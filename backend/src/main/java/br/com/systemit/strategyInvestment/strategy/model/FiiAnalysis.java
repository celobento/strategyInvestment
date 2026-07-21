package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fii_analysi", schema = "public")
@Data
public class FiiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;

    @Column(length = 10)
    private String ticket;

    @Column(length = 255)
    private String nome;

    @Column(length = 100)
    private String segmento;

    @Column(name = "valor_atual", precision = 16, scale = 2)
    private BigDecimal valorAtual;

    @Column(name = "dividend_yield", precision = 16, scale = 2)
    private BigDecimal dividendYield;

    @Column(name = "preco_valor_patrimonial", precision = 16, scale = 2)
    private BigDecimal precoValorPatrimonial;

    @Column(name = "fator_renda", precision = 16, scale = 2)
    private BigDecimal fatorRenda;

    @Column(name = "rendimento_ultimos_12m", precision = 16, scale = 2)
    private BigDecimal rendimentoUltimos12m;

    @Column(name = "rendimento_medio_ultimos_12m", precision = 16, scale = 2)
    private BigDecimal rendimentoMedioUltimos12m;

    @Column(name = "rendimento_mensal_medio24m", precision = 16, scale = 2)
    private BigDecimal rendimentoMensalMedio24m;

    @Column(name = "liquidez_media_diaria", precision = 16, scale = 2)
    private BigDecimal liquidezMediaDiaria;

    @Column(name = "ultimo_rendimento", precision = 16, scale = 2)
    private BigDecimal ultimoRendimento;

    @Column(name = "data_pagamento_ultimo_rendimento", length = 20)
    private String dataPagamentoUltimoRendimento;

    @Column(name = "proximo_rendimento", precision = 16, scale = 2)
    private BigDecimal proximoRendimento;

    @Column(name = "data_pagamento_proximo_rendimento", length = 20)
    private String dataPagamentoProximoRendimento;
}
