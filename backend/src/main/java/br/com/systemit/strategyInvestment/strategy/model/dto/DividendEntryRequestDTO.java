package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DividendEntryRequestDTO(
        @NotBlank String category,
        @NotNull @Min(1) @Max(12) Integer month,
        @NotNull Integer year,
        @NotNull BigDecimal value,
        String currency
) {}
