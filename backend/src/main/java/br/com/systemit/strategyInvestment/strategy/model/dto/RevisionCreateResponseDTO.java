package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.strategy.model.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(name = "RevisionCreateResponse")
public record RevisionCreateResponseDTO(

        Integer id,
        BigDecimal currentValue,
        BigDecimal dividendYeld,
        BigDecimal incomeFactor,
        BigDecimal pVp,
        BigDecimal lastIncome,
        LocalDateTime dateLastIncome,
        BigDecimal nextIncome,
        LocalDateTime dateNextIncome,
        String notes,
        Asset asset) {
}
