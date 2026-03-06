package br.com.systemit.strategyInvestment.strategy.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BrokerCreateResponse")
public record BrokerCreateResponseDTO(
        Integer id,
        String name,
        String webSite) {
}
