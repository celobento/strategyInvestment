package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DividendEntryResponseDTO(
        Integer id,
        String category,
        Integer month,
        Integer year,
        BigDecimal value,
        String currency,
        LocalDateTime createdAt
) {}
