package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(name = "RevisionCreateRequest")
public record RevisionCreateRequestDTO(

        @NotNull(message = "Required field")
        BigDecimal currentValue,

        @NotNull(message = "Required field")
        BigDecimal dividendYeld,

        @NotNull(message = "Required field")
        BigDecimal incomeFactor,

        @NotNull(message = "Required field")
        BigDecimal pVp,

        @NotNull(message = "Required field")
        BigDecimal lastIncome,

        @NotNull(message = "Required field")
        LocalDate dateLastIncome,

        BigDecimal nextIncome,

        LocalDate dateNextIncome,

        @Size(max = 500, message = "Size field out range")
        String notes,

        @NotNull(message = "Required field")
        Integer asset
) {
}
