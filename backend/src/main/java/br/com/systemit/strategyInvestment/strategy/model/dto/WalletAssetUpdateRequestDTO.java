package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "WalletAssetUpdateRequest")
public record WalletAssetUpdateRequestDTO(
        BigDecimal quantity,
        BigDecimal mediumPrice,
        BigDecimal currentPrice) {
}
