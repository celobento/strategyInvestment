package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record GoalResponseDTO(
        Integer id,
        String description,
        BigDecimal goalValue,
        LocalDate limitDate,
        LocalDate startDate,
        BigDecimal monthlyRate,
        BigDecimal initialBalance,
        LocalDateTime createdAt
) {}
