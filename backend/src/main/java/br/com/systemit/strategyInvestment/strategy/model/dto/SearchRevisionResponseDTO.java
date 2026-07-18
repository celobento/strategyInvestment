package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(name = "SearchRevisionResponse")
public record SearchRevisionResponseDTO(
        Integer id,
        LocalDateTime createdDate,
        BigDecimal currentValue,
        BigDecimal dividendYeld,
        BigDecimal incomeFactor,
        BigDecimal pVp,
        BigDecimal lastIncome,
        LocalDate dateLastIncome,
        BigDecimal nextIncome,
        LocalDate dateNextIncome,
        String notes,
        Asset asset) {
}
