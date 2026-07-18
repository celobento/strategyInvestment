package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record WalletStrategyCreateRequestDTO(
        @NotNull(message = "Category ID is required") Integer categoryId,
        @NotNull(message = "Percent is required")
        @DecimalMin(value = "0.01", message = "Percent must be greater than 0")
        @DecimalMax(value = "100.00", message = "Percent must be at most 100")
        BigDecimal percent
) {
}
