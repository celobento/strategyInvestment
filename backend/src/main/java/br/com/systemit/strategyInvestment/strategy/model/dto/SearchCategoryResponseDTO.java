package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SearchCategoryResponse")
public record SearchCategoryResponseDTO(
        Integer id,
        String name,
        String description,
        Integer countryId,
        String countryName,
        String countryAcronym) {
}
