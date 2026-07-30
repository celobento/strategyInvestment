package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.ReitsAnalysis;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiSyncStatusDTO;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import br.com.systemit.strategyInvestment.strategy.repository.ReitsAnalysisRepository;
import br.com.systemit.strategyInvestment.strategy.repository.WalletAssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReitsAnalysisService {

    private static final String ALREITS_BASE_URL = "https://alreits.com/reits/";

    private final ReitsAnalysisRepository repository;
    private final WalletAssetRepository walletAssetRepository;
    private final AssetRepository assetRepository;

    // ── Sync state ───────────────────────────────────────────────────────────
    private final AtomicBoolean  syncRunning   = new AtomicBoolean(false);
    private final AtomicInteger  syncTotal     = new AtomicInteger(0);
    private final AtomicInteger  syncProcessed = new AtomicInteger(0);
    private final AtomicInteger  syncUpdated   = new AtomicInteger(0);
    private final AtomicInteger  syncFailed    = new AtomicInteger(0);
    private volatile List<String> syncFailedTickets = Collections.emptyList();

    // ── Queries ──────────────────────────────────────────────────────────────

    public List<ReitsAnalysis> findAll() {
        return repository.findAllByOrderBySectorAscTicketAsc();
    }

    public FiiSyncStatusDTO getStatus() {
        return new FiiSyncStatusDTO(
                syncRunning.get(),
                syncProcessed.get(),
                syncTotal.get(),
                syncUpdated.get(),
                syncFailed.get(),
                syncFailedTickets);
    }

    // ── Sync ─────────────────────────────────────────────────────────────────

    public boolean startSync(String singleTicket) {
        if (!syncRunning.compareAndSet(false, true)) return false;

        List<String> tickets = (singleTicket != null && !singleTicket.isBlank())
                ? List.of(singleTicket.toUpperCase())
                : walletAssetRepository.findDistinctReitTickets();

        syncTotal.set(tickets.size());
        syncProcessed.set(0);
        syncUpdated.set(0);
        syncFailed.set(0);
        syncFailedTickets = new ArrayList<>();

        log.info("REITs sync started — {} tickets", tickets.size());

        CompletableFuture.runAsync(() -> {
            HttpClient client = HttpClient.newHttpClient();
            List<String> failed = new ArrayList<>();

            for (String ticket : tickets) {
                try {
                    repository.deleteAllByTicket(ticket);

                    ReitsAnalysis analysis = fetchFromAlReits(ticket, client);
                    repository.save(analysis);
                    syncUpdated.incrementAndGet();
                    propagateYieldToAsset(ticket, analysis.getDividendYield());
                    log.info("Synced REIT {} — price={} dy={} marketCap={}", ticket, analysis.getValorAtual(), analysis.getDividendYield(), analysis.getMarketCap());

                } catch (Exception e) {
                    syncFailed.incrementAndGet();
                    failed.add(ticket);
                    log.error("Error syncing REIT {}: {}", ticket, e.getMessage());
                } finally {
                    syncProcessed.incrementAndGet();
                    syncFailedTickets = Collections.unmodifiableList(new ArrayList<>(failed));
                }
            }

            syncRunning.set(false);
            log.info("REITs sync done — updated: {}, failed: {}", syncUpdated.get(), syncFailed.get());
        });

        return true;
    }

    // ── alreits.com HTML scrape ───────────────────────────────────────────────

    private ReitsAnalysis fetchFromAlReits(String ticket, HttpClient client) throws Exception {
        String url = ALREITS_BASE_URL + ticket.toUpperCase();
        log.info("Fetching REIT data from: {}", url);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .header("Referer", "https://alreits.com/")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                .header("Accept-Language", "en-US,en;q=0.9")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("alreits.com returned HTTP " + response.statusCode() + " for " + ticket);
        }

        Document doc = Jsoup.parse(response.body());

        // Log first 3000 chars of body so selectors can be identified
        log.debug("alreits.com HTML for {} (first 3000 chars): {}", ticket, response.body().substring(0, Math.min(3000, response.body().length())));

        // Sector
        String sector = select(doc, "#summary > div.ReitInformation__ReitInfo-sc-hkyxfw-1.emRWPP.MuiBox-root.css-0 > div.ReitInformation__OtherInfo-sc-hkyxfw-3.cSBmCn.MuiBox-root.css-0 > div:nth-child(1) > a > p");

        // Price
        String priceStr = select(doc, "#price > div.CardHeaderstyles__Header-sc-110eifx-0.hczwnq.PropertyDataViewer__Header-sc-10x7rs3-1.ercgVc.condensed.MuiBox-root.css-0 > div.PropertyDataViewer__ValuesGroup-sc-10x7rs3-3.kQbIXb.MuiBox-root.css-0 > div > div.Value__ValueContainer-sc-1s7qyn1-1.ebPkPz.right.MuiBox-root.css-0 > p");

        // Yield
        String yieldStr = select(doc, "#dividends > div.CardHeaderstyles__Header-sc-110eifx-0.hczwnq.PropertyDataViewer__Header-sc-10x7rs3-1.ercgVc.condensed.MuiBox-root.css-0 > div.PropertyDataViewer__ValuesGroup-sc-10x7rs3-3.kQbIXb.MuiBox-root.css-0 > div:nth-child(1) > div > p");

        // Market Cap
        String mcapStr = select(doc, "#__next > div.MuiContainer-root.MuiContainer-maxWidthLg.symbol__PageContainer-sc-1ldvqjy-0.jmwSgb.css-1qsxih2 > div.Cardstyles__CardContainer-sc-103ivve-0.jNchfr.CardNumber__CardContainer-sc-1dm7u9n-0.diQUdn.symbol__MarketCap-sc-1ldvqjy-3.uqorr.MuiBox-root.css-z846yz > div.CardNumber__ValueContainer-sc-1dm7u9n-2.bCegno.MuiBox-root.css-0 > div > div > p");

        log.info("Scraped REIT {} — sector={} price={} yield={} marketCap={}", ticket, sector, priceStr, yieldStr, mcapStr);

        ReitsAnalysis a = new ReitsAnalysis();
        a.setTicket(ticket.toUpperCase());
        a.setDataCadastro(LocalDateTime.now());
        a.setSector(sector);
        a.setValorAtual(parseDecimal(priceStr));
        a.setDividendYield(parseDecimal(yieldStr));
        a.setMarketCap(parseDecimal(mcapStr));

        return a;
    }

    // ── Propagate yield to Asset ──────────────────────────────────────────────

    private void propagateYieldToAsset(String ticket, BigDecimal yield) {
        if (yield == null) return;
        try {
            int rows = assetRepository.updateDividendYieldByTicket(ticket, yield);
            if (rows > 0) log.info("Updated dividendYield={} on asset '{}'", yield, ticket);
        } catch (Exception e) {
            log.warn("Could not propagate yield for REIT {}: {}", ticket, e.getMessage());
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String select(Document doc, String cssSelector) {
        if (cssSelector.startsWith("TODO_")) return null;
        Element el = doc.selectFirst(cssSelector);
        if (el == null) {
            log.warn("Selector not found: {}", cssSelector);
            return null;
        }
        return el.text().trim();
    }

    private BigDecimal parseDecimal(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            // Handle $1.2B, $500M, $1,234.56, 6.45%, etc.
            String upper = raw.toUpperCase();
            double multiplier = 1;
            if (upper.endsWith("B")) { multiplier = 1_000_000_000.0; raw = raw.substring(0, raw.length() - 1); }
            else if (upper.endsWith("M")) { multiplier = 1_000_000.0; raw = raw.substring(0, raw.length() - 1); }
            else if (upper.endsWith("K")) { multiplier = 1_000.0; raw = raw.substring(0, raw.length() - 1); }
            String cleaned = raw.replaceAll("[^0-9.\\-]", "");
            if (cleaned.isEmpty()) return null;
            double value = Double.parseDouble(cleaned) * multiplier;
            return BigDecimal.valueOf(value);
        } catch (Exception e) {
            log.warn("Could not parse decimal from '{}'", raw);
            return null;
        }
    }
}
