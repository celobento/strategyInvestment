package br.com.systemit.strategyInvestment.auth.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(name = "SearchUserResponse")
public record SearchUserResponseDTO(
        Integer id,
        LocalDateTime createdDate,
        String username,
        Boolean firstAccess,
        String email,
        List<String> roles
) {
}
