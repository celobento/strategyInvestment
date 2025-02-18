package br.com.systemit.strategyInvestment.strategy.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryUpdateRequestDTO(

        @NotBlank(message = "Campo obrigatório")
        @Size(min = 2, max = 100, message = "campo fora do tamanho padrão")
        String name,

        String description) {
}
