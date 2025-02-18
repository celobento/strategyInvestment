package br.com.systemit.strategyInvestment.dto;

import org.springframework.http.HttpStatus;

import java.util.List;

public record Problem(
        int status,
        String title,
        List<Validations> validations
) {
    public static Problem erro400(String title, String detail){
        return new Problem(HttpStatus.BAD_REQUEST.value(), title, List.of());
    }
}
