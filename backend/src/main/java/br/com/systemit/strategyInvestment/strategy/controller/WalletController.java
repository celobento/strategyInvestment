package br.com.systemit.strategyInvestment.strategy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchWalletResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.WalletMapper;
import br.com.systemit.strategyInvestment.strategy.service.WalletService;
import br.com.systemit.strategyInvestment.util.JsonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("wallets")
@RequiredArgsConstructor
@Tag(name = "Wallet")
public class WalletController {

    private final WalletService walletService;
    private final WalletMapper walletMapper;

    @GetMapping
    @Operation(summary = "Search wallets", description = "List all wallets or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchWalletResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<Wallet> result = walletService.search(name);
        List<SearchWalletResponseDTO> response = result.stream()
                .map(walletMapper::toDtoSearchWalletResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get wallet by ID", description = "Find a single wallet by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return walletService.findById(id)
                .map(wallet -> {
                    SearchWalletResponseDTO dto = walletMapper.toDtoSearchWalletResponse(wallet);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    @Operation(summary = "Create Wallet", description = "Endpoint to create a new wallet")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to create new wallet")

    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid WalletCreateRequestDTO dto) {
        Wallet wallet = walletMapper.toEntity(dto);
        wallet = walletService.save(wallet);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(walletMapper.toDtoCreateResponse(wallet));
    }

    @PatchMapping("/{id}/min-asset-pays")
    @Operation(summary = "Update min asset pays", description = "Set the minimum income each asset should pay in this wallet")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<Object> updateMinAssetPays(
            @PathVariable("id") Integer id,
            @RequestBody java.util.Map<String, BigDecimal> body) {
        try {
            Wallet wallet = walletService.updateMinAssetPays(id, body.get("minAssetPays"));
            return ResponseEntity.ok(walletMapper.toDtoSearchWalletResponse(wallet));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete wallet", description = "Endpoint to delete a wallet")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a wallet")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id) {
        walletService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
