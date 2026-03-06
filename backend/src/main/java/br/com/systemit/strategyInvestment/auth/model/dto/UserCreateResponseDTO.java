package br.com.systemit.strategyInvestment.auth.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserCreateResponseDTO(
        Integer id,
        LocalDateTime createdDate,
        String username,
        Boolean firstAccess,
        String email,
        List<String> roles) {
}
