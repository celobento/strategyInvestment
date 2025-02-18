package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.Size;

public record SearchCategoryRequestDTO(
        @Size(min = 2, max = 100)
        String name
) {
}
