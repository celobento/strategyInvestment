package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SearchSectorResponse")
public record SearchSectorResponseDTO(
        Integer id,
        String name,
        String description
) {
}
