package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.WalletAsset;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletAssetCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletAssetResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletAssetUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.service.WalletAssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("wallets/{walletId}/assets")
@RequiredArgsConstructor
@Tag(name = "Wallet Assets")
public class WalletAssetController {

    private final WalletAssetService walletAssetService;

    @GetMapping
    @Operation(summary = "List wallet assets")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    public ResponseEntity<List<WalletAssetResponseDTO>> list(@PathVariable Integer walletId) {
        List<WalletAsset> items = walletAssetService.findByWalletId(walletId);
        return ResponseEntity.ok(items.stream().map(WalletAssetController::toDto).collect(Collectors.toList()));
    }

    @PostMapping
    @Operation(summary = "Add asset to wallet")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Added"),
            @ApiResponse(responseCode = "409", description = "Already in wallet"),
    })
    public ResponseEntity<WalletAssetResponseDTO> add(
            @PathVariable Integer walletId,
            @RequestBody @Valid WalletAssetCreateRequestDTO dto) {
        try {
            WalletAsset saved = walletAssetService.add(walletId, dto.assetId());
            return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PatchMapping("/{walletAssetId}")
    @Operation(summary = "Update position data (quantity, prices)")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "Updated"))
    public ResponseEntity<WalletAssetResponseDTO> updatePosition(
            @PathVariable Integer walletId,
            @PathVariable Integer walletAssetId,
            @RequestBody WalletAssetUpdateRequestDTO dto) {
        try {
            WalletAsset updated = walletAssetService.updatePosition(
                    walletAssetId, dto.quantity(), dto.mediumPrice(), dto.currentPrice());
            return ResponseEntity.ok(toDto(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{walletAssetId}")
    @Operation(summary = "Remove asset from wallet")
    @ApiResponses(@ApiResponse(responseCode = "204", description = "Removed"))
    public ResponseEntity<Void> remove(
            @PathVariable Integer walletId,
            @PathVariable Integer walletAssetId) {
        walletAssetService.remove(walletAssetId);
        return ResponseEntity.noContent().build();
    }

    static WalletAssetResponseDTO toDto(WalletAsset wa) {
        var a = wa.getAsset();
        return new WalletAssetResponseDTO(
                wa.getId(),
                wa.getAddedAt(),
                wa.getWallet() != null ? wa.getWallet().getId() : null,
                a.getId(),
                a.getName(),
                a.getTicket(),
                a.getCategory() != null ? a.getCategory().getName() : null,
                a.getSector() != null ? a.getSector().getName() : null,
                a.getSegment() != null ? a.getSegment().getName() : null,
                a.getCountry() != null ? a.getCountry().getAcronym() : null,
                wa.getQuantity(),
                wa.getMediumPrice(),
                wa.getCurrentPrice(),
                a.getIncomeType() != null ? a.getIncomeType().name() : null,
                a.getAssetType() != null ? a.getAssetType().getName() : null,
                a.getIndicator(),
                a.getCeilingPrice()
        );
    }
}
