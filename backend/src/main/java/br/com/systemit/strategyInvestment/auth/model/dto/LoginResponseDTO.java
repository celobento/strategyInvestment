package br.com.systemit.strategyInvestment.auth.model.dto;

import java.util.List;

public record LoginResponseDTO(
        Integer id,
        String username,
        String email,
        List<String> roles) {
}
