package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.dto.WalletAssetResponseDTO;
import br.com.systemit.strategyInvestment.strategy.service.WalletAssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("wallet-assets")
@RequiredArgsConstructor
@Tag(name = "Portfolio")
public class PortfolioController {

    private final WalletAssetService walletAssetService;

    @GetMapping
    @Operation(summary = "List all wallet assets across all wallets")
    public ResponseEntity<List<WalletAssetResponseDTO>> all() {
        List<WalletAssetResponseDTO> result = walletAssetService.findAll()
                .stream()
                .map(WalletAssetController::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
