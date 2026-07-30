package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reits_analysi", schema = "strategy")
@Data
public class ReitsAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;

    @Column(length = 20)
    private String ticket;

    @Column(length = 100)
    private String sector;

    @Column(name = "valor_atual", precision = 16, scale = 2)
    private BigDecimal valorAtual;

    @Column(name = "dividend_yield", precision = 16, scale = 2)
    private BigDecimal dividendYield;

    @Column(name = "market_cap", precision = 24, scale = 2)
    private BigDecimal marketCap;
}
