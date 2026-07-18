package br.com.systemit.strategyInvestment.auth.model.dto;

public record LoginRequestDTO(
        String username,
        String password) {
}
