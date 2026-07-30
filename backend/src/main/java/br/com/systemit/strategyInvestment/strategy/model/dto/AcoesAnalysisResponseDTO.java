package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AcoesAnalysisResponseDTO(
        Integer id,
        LocalDateTime dataCadastro,
        String ticket,
        String setor,
        String segmento,
        BigDecimal valorAtual,
        BigDecimal dividendYield,
        BigDecimal pvp,
        BigDecimal fatorRenda,
        BigDecimal ultimoRendimento,
        BigDecimal rendimento12m,
        BigDecimal rendimentoMedio12m,
        BigDecimal rendimentoMensalMedio24m,
        BigDecimal liquidezMediaDiaria
) {}
