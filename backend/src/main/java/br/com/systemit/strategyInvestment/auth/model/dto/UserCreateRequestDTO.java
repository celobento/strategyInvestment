package br.com.systemit.strategyInvestment.auth.model.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserCreateRequestDTO(

        @NotBlank(message = "Required field") @Size(min = 2, max = 50, message = "Size field out range") String username,

        @NotBlank(message = "Required field") @Size(min = 6, max = 200, message = "Size field out range") String password,

        @Email(message = "Invalid email") String email,

        @NotNull(message = "Required field") List<String> roles) {
}
