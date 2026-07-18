package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SearchBrokerResponse")
public record SearchBrokerResponseDTO(
        Integer id,
        String name,
        String webSite) {
}
