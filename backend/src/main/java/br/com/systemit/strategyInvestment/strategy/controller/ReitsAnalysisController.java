package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.ReitsAnalysis;
import br.com.systemit.strategyInvestment.strategy.model.dto.FiiSyncStatusDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.ReitsAnalysisResponseDTO;
import br.com.systemit.strategyInvestment.strategy.service.ReitsAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("reits-analysis")
@RequiredArgsConstructor
@Tag(name = "REITs Analysis")
public class ReitsAnalysisController {

    private final ReitsAnalysisService service;

    @GetMapping
    @Operation(summary = "List REITs analysis")
    public ResponseEntity<List<ReitsAnalysisResponseDTO>> list() {
        return ResponseEntity.ok(service.findAll().stream().map(ReitsAnalysisController::toDto).toList());
    }

    @PostMapping("/sync")
    @Operation(summary = "Start REITs sync", description = "Fires background sync for all wallet REIT tickets. Pass ?ticket=O to sync a single ticker.")
    public ResponseEntity<FiiSyncStatusDTO> startSync(@RequestParam(required = false) String ticket) {
        boolean started = service.startSync(ticket);
        if (!started) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(service.getStatus());
        }
        return ResponseEntity.accepted().body(service.getStatus());
    }

    @GetMapping("/sync/status")
    @Operation(summary = "Get REITs sync status")
    public ResponseEntity<FiiSyncStatusDTO> syncStatus() {
        return ResponseEntity.ok(service.getStatus());
    }

    private static ReitsAnalysisResponseDTO toDto(ReitsAnalysis r) {
        return new ReitsAnalysisResponseDTO(
                r.getId(),
                r.getDataCadastro(),
                r.getTicket(),
                r.getSector(),
                r.getValorAtual(),
                r.getDividendYield(),
                r.getMarketCap()
        );
    }
}
