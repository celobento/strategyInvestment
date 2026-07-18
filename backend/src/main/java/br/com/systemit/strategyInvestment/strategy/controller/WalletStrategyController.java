package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.WalletStrategy;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletStrategyCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletStrategyResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletStrategyUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.service.WalletStrategyService;
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
@RequestMapping("wallets/{walletId}/strategies")
@RequiredArgsConstructor
@Tag(name = "Wallet Strategy")
public class WalletStrategyController {

    private final WalletStrategyService walletStrategyService;

    @GetMapping
    @Operation(summary = "List wallet strategy allocations")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    public ResponseEntity<List<WalletStrategyResponseDTO>> list(@PathVariable Integer walletId) {
        List<WalletStrategy> items = walletStrategyService.findByWalletId(walletId);
        return ResponseEntity.ok(items.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @PostMapping
    @Operation(summary = "Add category allocation to wallet strategy")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Added"),
            @ApiResponse(responseCode = "409", description = "Category already in strategy"),
    })
    public ResponseEntity<WalletStrategyResponseDTO> add(
            @PathVariable Integer walletId,
            @RequestBody @Valid WalletStrategyCreateRequestDTO dto) {
        try {
            WalletStrategy saved = walletStrategyService.add(walletId, dto.categoryId(), dto.percent());
            return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{walletStrategyId}")
    @Operation(summary = "Update allocation percent")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<WalletStrategyResponseDTO> update(
            @PathVariable Integer walletId,
            @PathVariable Integer walletStrategyId,
            @RequestBody @Valid WalletStrategyUpdateRequestDTO dto) {
        try {
            WalletStrategy updated = walletStrategyService.updatePercent(walletStrategyId, dto.percent());
            return ResponseEntity.ok(toDto(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{walletStrategyId}")
    @Operation(summary = "Remove allocation from wallet strategy")
    @ApiResponses(@ApiResponse(responseCode = "204", description = "Removed"))
    public ResponseEntity<Void> remove(
            @PathVariable Integer walletId,
            @PathVariable Integer walletStrategyId) {
        walletStrategyService.remove(walletStrategyId);
        return ResponseEntity.noContent().build();
    }

    private WalletStrategyResponseDTO toDto(WalletStrategy ws) {
        var cat = ws.getCategory();
        var country = cat.getCountry();
        return new WalletStrategyResponseDTO(
                ws.getId(),
                ws.getCreatedAt(),
                cat.getId(),
                cat.getName(),
                country != null ? country.getName() : null,
                country != null ? country.getAcronym() : null,
                ws.getPercent()
        );
    }
}
