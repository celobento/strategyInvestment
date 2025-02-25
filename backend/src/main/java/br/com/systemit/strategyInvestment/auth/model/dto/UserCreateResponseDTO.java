package br.com.systemit.strategyInvestment.auth.model.dto;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

public record UserCreateResponseDTO(
    Integer id,
    LocalDateTime createdDate,
    String username,
    Boolean firstAccess,
    String email,
    List<String> roles
) {
}
