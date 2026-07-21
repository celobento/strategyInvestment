package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalRequestDTO(
        @NotBlank String description,
        @NotNull BigDecimal goalValue,
        @NotNull LocalDate limitDate,
        @NotNull LocalDate startDate,
        @NotNull BigDecimal monthlyRate,
        @NotNull BigDecimal initialBalance
) {}
