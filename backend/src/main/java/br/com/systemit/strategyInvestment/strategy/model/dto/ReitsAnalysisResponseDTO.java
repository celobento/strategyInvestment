package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReitsAnalysisResponseDTO(
        Integer id,
        LocalDateTime dataCadastro,
        String ticket,
        String sector,
        BigDecimal valorAtual,
        BigDecimal dividendYield,
        BigDecimal marketCap
) {}
