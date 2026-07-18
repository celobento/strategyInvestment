package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.strategy.model.AssetType;
import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.IncomeType;
import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.Segment;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "SearchAssetResponse")
public record SearchAssetResponseDTO(
        Integer id,
        String name,
        String ticket,
        String description,
        Country country,
        Category category,
        Sector sector,
        Segment segment,
        IncomeType incomeType,
        AssetType assetType,
        BigDecimal ceilingPrice,
        BigDecimal navEstimated,
        BigDecimal premiumDiscount,
        String indicator) {
}
