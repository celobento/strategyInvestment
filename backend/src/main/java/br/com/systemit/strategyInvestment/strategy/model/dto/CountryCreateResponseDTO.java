package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CountryCreateResponse")
public record CountryCreateResponseDTO(
        Integer id,
        String name,
        String acronym) {
}
