package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(name = "WalletCreateRequest")
public record WalletCreateRequestDTO(

        @Size(max = 100, message = "Size field out range")
        String name,

        @NotNull(message = "Required field")
        Integer user
) {
}
