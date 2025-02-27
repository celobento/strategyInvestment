package br.com.systemit.strategyInvestment.dto;

import org.springframework.http.HttpStatus;

import java.util.List;

public record Validations(
        String property,
        String value
) {
}
