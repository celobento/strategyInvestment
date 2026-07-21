package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FiiAnalysisResponseDTO(
        Integer id,
        LocalDateTime dataCadastro,
        String ticket,
        String nome,
        String segmento,
        BigDecimal valorAtual,
        BigDecimal dividendYield,
        BigDecimal precoValorPatrimonial,
        BigDecimal fatorRenda,
        BigDecimal rendimentoUltimos12m,
        BigDecimal rendimentoMedioUltimos12m,
        BigDecimal rendimentoMensalMedio24m,
        BigDecimal liquidezMediaDiaria,
        BigDecimal ultimoRendimento,
        String dataPagamentoUltimoRendimento,
        BigDecimal proximoRendimento,
        String dataPagamentoProximoRendimento
) {}
