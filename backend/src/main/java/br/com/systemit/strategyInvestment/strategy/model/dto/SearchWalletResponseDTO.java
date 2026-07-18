package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.auth.model.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(name = "SearchWalletResponse")
public record SearchWalletResponseDTO(
        Integer id,
        String name,
        BigDecimal currentValue,
        BigDecimal dividendYeld,
        BigDecimal minAssetPays,
        LocalDateTime createdDate,
        User user) {
}
