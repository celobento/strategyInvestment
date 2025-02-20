package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SectorCreateResponse")
public record SectorCreateResponseDTO(
        Integer id,
        String name,
        String description) {
}
