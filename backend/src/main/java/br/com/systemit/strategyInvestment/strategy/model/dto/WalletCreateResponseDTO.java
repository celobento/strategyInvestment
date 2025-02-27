package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.strategy.model.Asset;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(name = "WalletCreateResponse")
public record WalletCreateResponseDTO(

        Integer id,
        BigDecimal currentValue,
        BigDecimal dividendYeld,
        String name,
        User user) {
}
