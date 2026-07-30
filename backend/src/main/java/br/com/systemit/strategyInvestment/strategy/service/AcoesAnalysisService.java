package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.AcoesAnalysis;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiSyncStatusDTO;
import br.com.systemit.strategyInvestment.strategy.repository.AcoesAnalysisRepository;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
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
public class AcoesAnalysisService {

    private static final String STATUS_INVEST_BASE_URL = "https://statusinvest.com.br/acoes/";

    private final AcoesAnalysisRepository repository;
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

    public List<AcoesAnalysis> findAll() {
        return repository.findAllByOrderBySetorAscSegmentoAscTicketAsc();
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
                : walletAssetRepository.findDistinctAcoesTickets();
        syncTotal.set(tickets.size());
        syncProcessed.set(0);
        syncUpdated.set(0);
        syncFailed.set(0);
        syncFailedTickets = new ArrayList<>();

        log.info("Acoes sync started — {} tickets", tickets.size());

        CompletableFuture.runAsync(() -> {
            HttpClient client = HttpClient.newHttpClient();
            List<String> failed = new ArrayList<>();

            for (String ticket : tickets) {
                try {
                    repository.deleteAllByTicket(ticket);

                    AcoesAnalysis analysis = fetchFromStatusInvest(ticket, client);
                    repository.save(analysis);
                    syncUpdated.incrementAndGet();
                    propagateYieldToAsset(ticket, analysis.getDividendYield());
                    log.info("Synced acoes {} — price={} dy={}", ticket, analysis.getValorAtual(), analysis.getDividendYield());

                } catch (Exception e) {
                    syncFailed.incrementAndGet();
                    failed.add(ticket);
                    log.error("Error syncing acoes {}: {}", ticket, e.getMessage());
                } finally {
                    syncProcessed.incrementAndGet();
                    syncFailedTickets = Collections.unmodifiableList(new ArrayList<>(failed));
                }
            }

            syncRunning.set(false);
            log.info("Acoes sync done — updated: {}, failed: {}", syncUpdated.get(), syncFailed.get());
        });

        return true;
    }

    // ── StatusInvest HTML scrape ──────────────────────────────────────────────

    private AcoesAnalysis fetchFromStatusInvest(String ticket, HttpClient client) throws Exception {
        String url = STATUS_INVEST_BASE_URL + ticket.toLowerCase();
        log.info("Fetching acoes data from: {}", url);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .header("Referer", "https://statusinvest.com.br/acoes")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                .header("Accept-Language", "pt-BR,pt;q=0.9")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("StatusInvest returned HTTP " + response.statusCode() + " for " + ticket);
        }

        Document doc = Jsoup.parse(response.body());

        // Ticket: /html/body/main/div[1]/div/div/ul/li[1]/a
        String ticketVal = select(doc, "main > div:nth-child(1) > div > div > ul > li:nth-child(1) > a");

        // Setor
        String setor = select(doc, "#company-section > div:nth-child(1) > div > div.card.bg-main-gd-h.white-text.rounded.ov-hidden.pt-0.pb-0 > div > div:nth-child(1) > div > div > div > a > strong");

        // Segmento
        String segmento = select(doc, "#company-section > div:nth-child(1) > div > div.card.bg-main-gd-h.white-text.rounded.ov-hidden.pt-0.pb-0 > div > div:nth-child(3) > div > div > div > a > strong");

        // Vlr Atual
        String valorAtualStr = select(doc, "#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div.info.special.w-100.w-md-33.w-lg-20 > div > div:nth-child(1) > strong");

        // Yield
        String yieldStr = select(doc, "#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div:nth-child(4) > div > div:nth-child(1) > strong");

        // P/VP
        String pvpStr = select(doc, "#indicators-section > div.indicator-today-container > div > div:nth-child(1) > div > div:nth-child(4) > div > div > strong");

        log.info("Scraped {} — ticket={} setor={} segmento={} valorAtual={} yield={} pvp={}",
                ticket, ticketVal, setor, segmento, valorAtualStr, yieldStr, pvpStr);

        AcoesAnalysis a = new AcoesAnalysis();
        a.setTicket(ticket.toUpperCase());
        a.setDataCadastro(LocalDateTime.now());
        a.setSetor(setor);
        a.setSegmento(segmento);
        a.setValorAtual(parseDecimal(valorAtualStr));
        a.setDividendYield(parseDecimal(yieldStr));
        a.setPvp(parseDecimal(pvpStr));

        return a;
    }

    // ── Propagate yield to Asset ──────────────────────────────────────────────

    private void propagateYieldToAsset(String ticket, BigDecimal yield) {
        if (yield == null) return;
        try {
            int rows = assetRepository.updateDividendYieldByTicket(ticket, yield);
            if (rows > 0) log.info("Updated dividendYield={} on asset '{}'", yield, ticket);
        } catch (Exception e) {
            log.warn("Could not propagate yield for acoes {}: {}", ticket, e.getMessage());
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String select(Document doc, String cssSelector) {
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
            String cleaned = raw.replace(".", "").replace(",", ".").replaceAll("[^0-9.\\-]", "");
            if (cleaned.isEmpty()) return null;
            return new BigDecimal(cleaned);
        } catch (Exception e) {
            log.warn("Could not parse decimal from '{}'", raw);
            return null;
        }
    }
}
