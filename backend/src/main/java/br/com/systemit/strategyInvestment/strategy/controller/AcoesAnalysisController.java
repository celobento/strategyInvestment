package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.AcoesAnalysis;
import br.com.systemit.strategyInvestment.strategy.model.dto.AcoesAnalysisResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiSyncStatusDTO;
import br.com.systemit.strategyInvestment.strategy.service.AcoesAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("acoes-analysis")
@RequiredArgsConstructor
@Tag(name = "Acoes Analysis")
public class AcoesAnalysisController {

    private final AcoesAnalysisService service;

    @GetMapping
    @Operation(summary = "List Acoes analysis")
    public ResponseEntity<List<AcoesAnalysisResponseDTO>> list() {
        return ResponseEntity.ok(service.findAll().stream().map(AcoesAnalysisController::toDto).toList());
    }

    @PostMapping("/sync")
    @Operation(summary = "Start Acoes sync", description = "Fires background sync. Pass ?ticket=BBAS3 to sync a single ticker.")
    public ResponseEntity<FiiSyncStatusDTO> startSync(@RequestParam(required = false) String ticket) {
        boolean started = service.startSync(ticket);
        if (!started) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(service.getStatus());
        }
        return ResponseEntity.accepted().body(service.getStatus());
    }

    @GetMapping("/sync/status")
    @Operation(summary = "Get acoes sync status")
    public ResponseEntity<FiiSyncStatusDTO> syncStatus() {
        return ResponseEntity.ok(service.getStatus());
    }

    private static AcoesAnalysisResponseDTO toDto(AcoesAnalysis a) {
        return new AcoesAnalysisResponseDTO(
                a.getId(),
                a.getDataCadastro(),
                a.getTicket(),
                a.getSetor(),
                a.getSegmento(),
                a.getValorAtual(),
                a.getDividendYield(),
                a.getPvp(),
                a.getFatorRenda(),
                a.getUltimoRendimento(),
                a.getRendimento12m(),
                a.getRendimentoMedio12m(),
                a.getRendimentoMensalMedio24m(),
                a.getLiquidezMediaDiaria()
        );
    }
}
