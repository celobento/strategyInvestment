package br.com.systemit.strategyInvestment.auth.model.dto;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

public record UserCreateRequestDTO(

    @NotBlank(message = "Required field")
    @Size(min = 2, max = 50, message = "Size field out range")
    String username,

    @NotBlank(message = "Required field")
    @Size(min = 6, max = 200, message = "Size field out range")
    String password,

    @Email(message = "Invalid email")
    String email,

    @NotNull(message = "Required field")
    List<String> roles
) {
}
