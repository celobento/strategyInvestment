package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "SectorUpdateRequest")
public record SectorUpdateRequestDTO(

        @NotBlank(message = "Required field")
        @Size(min = 2, max = 100, message = "Size field out range")
        String name,

        String description) {
}
