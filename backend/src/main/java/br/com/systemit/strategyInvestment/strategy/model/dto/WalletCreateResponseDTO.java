package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;

import br.com.systemit.strategyInvestment.auth.model.User;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WalletCreateResponse")
public record WalletCreateResponseDTO(

		Integer id,
		BigDecimal currentValue,
		BigDecimal dividendYeld,
		BigDecimal minAssetPays,
		String name,
		User user) {
}
