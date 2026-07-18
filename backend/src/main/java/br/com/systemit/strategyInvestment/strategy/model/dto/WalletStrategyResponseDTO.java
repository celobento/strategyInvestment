package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WalletStrategyResponseDTO(
        Integer id,
        LocalDateTime createdAt,
        Integer categoryId,
        String categoryName,
        String countryName,
        String countryAcronym,
        BigDecimal percent
) {
}
