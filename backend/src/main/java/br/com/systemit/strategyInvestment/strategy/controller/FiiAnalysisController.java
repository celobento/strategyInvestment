package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.FiiAnalysis;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiAnalysisResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiSyncStatusDTO;
import br.com.systemit.strategyInvestment.strategy.service.FiiAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("fii-analysis")
@RequiredArgsConstructor
@Tag(name = "FII Analysis")
public class FiiAnalysisController {

    private final FiiAnalysisService service;

    @GetMapping
    @Operation(summary = "List FII analysis")
    public ResponseEntity<List<FiiAnalysisResponseDTO>> list(
            @RequestParam(required = false) String segmento) {
        List<FiiAnalysis> items = segmento != null && !segmento.isBlank()
                ? service.findBySegmento(segmento)
                : service.findAll();
        return ResponseEntity.ok(items.stream().map(FiiAnalysisController::toDto).toList());
    }

    @PostMapping("/sync")
    @Operation(summary = "Start FII sync", description = "Fires background sync for all wallet FII tickets. Returns 202 immediately.")
    public ResponseEntity<FiiSyncStatusDTO> startSync() {
        boolean started = service.startSync();
        if (!started) {
            // already running — return current status
            return ResponseEntity.status(HttpStatus.CONFLICT).body(service.getStatus());
        }
        return ResponseEntity.accepted().body(service.getStatus());
    }

    @GetMapping("/sync/status")
    @Operation(summary = "Get sync status")
    public ResponseEntity<FiiSyncStatusDTO> syncStatus() {
        return ResponseEntity.ok(service.getStatus());
    }

    private static FiiAnalysisResponseDTO toDto(FiiAnalysis f) {
        return new FiiAnalysisResponseDTO(
                f.getId(),
                f.getDataCadastro(),
                f.getTicket(),
                f.getNome(),
                f.getSegmento(),
                f.getValorAtual(),
                f.getDividendYield(),
                f.getPrecoValorPatrimonial(),
                f.getFatorRenda(),
                f.getRendimentoUltimos12m(),
                f.getRendimentoMedioUltimos12m(),
                f.getRendimentoMensalMedio24m(),
                f.getLiquidezMediaDiaria(),
                f.getUltimoRendimento(),
                f.getDataPagamentoUltimoRendimento(),
                f.getProximoRendimento(),
                f.getDataPagamentoProximoRendimento()
        );
    }
}
