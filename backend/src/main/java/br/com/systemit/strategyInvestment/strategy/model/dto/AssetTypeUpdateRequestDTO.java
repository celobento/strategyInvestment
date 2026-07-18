package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "AssetTypeUpdateRequest")
public record AssetTypeUpdateRequestDTO(

        @NotBlank(message = "Required field")
        @Size(min = 2, max = 100, message = "Size field out range")
        String name,

        @Size(max = 500, message = "Size field out range")
        String description) {
}
