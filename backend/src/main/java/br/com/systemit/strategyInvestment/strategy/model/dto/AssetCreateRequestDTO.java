package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "AssetCreateRequest")
public record AssetCreateRequestDTO(

                @NotBlank(message = "Required field") @Size(min = 2, max = 100, message = "Size field out range") String name,

                @NotBlank(message = "Required field") @Size(min = 2, max = 10, message = "Size field out range") String ticket,

                @Size(min = 2, max = 250, message = "Size field out range") String description,

                @NotNull(message = "Required field") Integer country,

                @NotNull(message = "Required field") Integer category,

                @NotNull(message = "Required field") Integer sector,

                @NotNull(message = "Required field") Integer segment) {
}
