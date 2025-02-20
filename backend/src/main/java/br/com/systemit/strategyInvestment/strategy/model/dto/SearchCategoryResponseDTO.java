package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(name = "SearchCategoryResponse")
public record SearchCategoryResponseDTO(
        Integer id,
        String name,
        String description
) {
}
