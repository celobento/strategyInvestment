package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import io.swagger.v3.oas.annotations.media.Schema;

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
