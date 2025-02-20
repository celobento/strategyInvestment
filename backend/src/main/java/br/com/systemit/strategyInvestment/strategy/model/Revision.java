package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_revision", schema = "strategy")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Revision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "current_value", nullable = false, precision = 16, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "dividend_yeld", nullable = false, precision = 16, scale = 2)
    private BigDecimal dividendYeld;

    @Column(name = "income_factor", nullable = false, precision = 16, scale = 2)
    private BigDecimal incomeFactor;

    @Column(name = "pvp", nullable = false, precision = 16, scale = 2)
    private BigDecimal pVp;

    @Column(name = "last_income", nullable = false, precision = 16, scale = 2)
    private BigDecimal lastIncome;

    @Column(name = "date_last_income", nullable = false)
    private LocalDateTime dateLastIncome;

    @Column(name = "next_income", nullable = true, precision = 16, scale = 2)
    private BigDecimal nextIncome;

    @Column(name = "date_next_income", nullable = true)
    private LocalDateTime dateNextIncome;

    @Column(name = "notes", nullable = true, length = 500)
    private String notes;

    @ManyToOne
    @JoinColumn(name = "asset_id", referencedColumnName = "id")
    private Asset asset;

}
