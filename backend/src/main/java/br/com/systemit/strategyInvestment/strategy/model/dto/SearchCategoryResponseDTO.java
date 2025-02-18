package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.Size;

public record SearchCategoryResponseDTO(
        Integer id,
        String name,
        String description
) {
}
