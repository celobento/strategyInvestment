package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.FiiAnalysis;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiSyncStatusDTO;
import br.com.systemit.strategyInvestment.strategy.repository.FiiAnalysisRepository;
import br.com.systemit.strategyInvestment.strategy.repository.WalletAssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class FiiAnalysisService {

    private static final String SYNC_URL = "http://localhost:8800/api/updateAsset?fii=";

    private final FiiAnalysisRepository repository;
    private final WalletAssetRepository walletAssetRepository;

    // ── Sync state (in-memory, single sync at a time) ────────────────────────
    private final AtomicBoolean syncRunning  = new AtomicBoolean(false);
    private final AtomicInteger syncTotal     = new AtomicInteger(0);
    private final AtomicInteger syncProcessed = new AtomicInteger(0);
    private final AtomicInteger syncUpdated   = new AtomicInteger(0);
    private final AtomicInteger syncFailed    = new AtomicInteger(0);
    private volatile List<String> syncFailedTickets = Collections.emptyList();

    public List<FiiAnalysis> findAll() {
        return repository.findAllByOrderBySegmentoAscPrecoValorPatrimonialAsc();
    }

    public List<FiiAnalysis> findBySegmento(String segmento) {
        return repository.findBySegmentoIgnoreCaseOrderByPrecoValorPatrimonialAsc(segmento);
    }

    public FiiSyncStatusDTO getStatus() {
        return new FiiSyncStatusDTO(
                syncRunning.get(),
                syncProcessed.get(),
                syncTotal.get(),
                syncUpdated.get(),
                syncFailed.get(),
                syncFailedTickets
        );
    }

    public boolean startSync() {
        if (!syncRunning.compareAndSet(false, true)) {
            return false; // already running
        }

        List<String> tickets = walletAssetRepository.findDistinctFiiTickets();
        syncTotal.set(tickets.size());
        syncProcessed.set(0);
        syncUpdated.set(0);
        syncFailed.set(0);
        syncFailedTickets = new ArrayList<>();

        log.info("FII sync started — {} tickets", tickets.size());

        CompletableFuture.runAsync(() -> {
            HttpClient client = HttpClient.newHttpClient();
            List<String> failed = new ArrayList<>();

            for (String ticket : tickets) {
                try {
                    String encoded = URLEncoder.encode(ticket, StandardCharsets.UTF_8);
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create(SYNC_URL + encoded))
                            .GET()
                            .build();
                    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                    if (response.statusCode() >= 200 && response.statusCode() < 300) {
                        syncUpdated.incrementAndGet();
                        log.info("Synced {} — HTTP {}", ticket, response.statusCode());
                    } else {
                        syncFailed.incrementAndGet();
                        failed.add(ticket);
                        log.warn("Failed to sync {} — HTTP {}", ticket, response.statusCode());
                    }
                } catch (Exception e) {
                    syncFailed.incrementAndGet();
                    failed.add(ticket);
                    log.error("Error syncing {}: {}", ticket, e.getMessage());
                } finally {
                    syncProcessed.incrementAndGet();
                    syncFailedTickets = Collections.unmodifiableList(new ArrayList<>(failed));
                }
            }

            syncRunning.set(false);
            log.info("FII sync done — updated: {}, failed: {}", syncUpdated.get(), syncFailed.get());
        });

        return true;
    }
}
