package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(name = "SearchCategoryRequest")
public record SearchCategoryRequestDTO(
        @Size(min = 2, max = 100)
        String name
) {
}
