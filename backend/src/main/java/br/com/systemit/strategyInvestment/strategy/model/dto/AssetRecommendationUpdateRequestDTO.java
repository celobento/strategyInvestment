package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "AssetRecommendationUpdateRequest")
public record AssetRecommendationUpdateRequestDTO(
        BigDecimal ceilingPrice,
        BigDecimal navEstimated,
        BigDecimal premiumDiscount,
        String indicator) {
}
