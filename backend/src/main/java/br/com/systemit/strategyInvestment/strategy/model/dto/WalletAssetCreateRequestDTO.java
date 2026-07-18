package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.NotNull;

public record WalletAssetCreateRequestDTO(
        @NotNull(message = "Asset ID is required") Integer assetId
) {
}
