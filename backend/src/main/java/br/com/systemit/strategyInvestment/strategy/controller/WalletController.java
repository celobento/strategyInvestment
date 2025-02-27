package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.WalletMapper;
import br.com.systemit.strategyInvestment.strategy.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("wallets")
@RequiredArgsConstructor
@Tag(name = "Wallet")
public class WalletController {

    private final WalletService walletService;
    private final WalletMapper walletMapper;

    @PostMapping
    @Operation( summary = "Create Wallet", description = "Endpoint to create a new wallet")
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

    @DeleteMapping("/{id}")
    @Operation( summary = "Delete wallet", description = "Endpoint to delete a wallet")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a wallet")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id){
        walletService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
