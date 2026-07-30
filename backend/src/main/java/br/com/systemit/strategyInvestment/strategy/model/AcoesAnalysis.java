package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "acoes_analysi", schema = "strategy")
@Data
public class AcoesAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;

    @Column(length = 10)
    private String ticket;

    @Column(length = 100)
    private String setor;

    @Column(length = 100)
    private String segmento;

    @Column(name = "valor_atual", precision = 16, scale = 2)
    private BigDecimal valorAtual;

    @Column(name = "dividend_yield", precision = 16, scale = 2)
    private BigDecimal dividendYield;

    @Column(precision = 16, scale = 2)
    private BigDecimal pvp;

    @Column(name = "fator_renda", precision = 16, scale = 2)
    private BigDecimal fatorRenda;

    @Column(name = "ultimo_rendimento", precision = 16, scale = 4)
    private BigDecimal ultimoRendimento;

    @Column(name = "rendimento_12m", precision = 16, scale = 4)
    private BigDecimal rendimento12m;

    @Column(name = "rendimento_medio_12m", precision = 16, scale = 4)
    private BigDecimal rendimentoMedio12m;

    @Column(name = "rendimento_mensal_medio_24m", precision = 16, scale = 4)
    private BigDecimal rendimentoMensalMedio24m;

    @Column(name = "liquidez_media_diaria", precision = 20, scale = 2)
    private BigDecimal liquidezMediaDiaria;
}
