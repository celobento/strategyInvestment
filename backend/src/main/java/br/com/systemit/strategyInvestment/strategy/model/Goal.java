package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_goal", schema = "strategy")
@Data
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "goal_value", nullable = false, precision = 16, scale = 2)
    private BigDecimal goalValue;

    @Column(name = "limit_date", nullable = false)
    private LocalDate limitDate;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "monthly_rate", nullable = false, precision = 8, scale = 4)
    private BigDecimal monthlyRate;

    @Column(name = "initial_balance", nullable = false, precision = 16, scale = 2)
    private BigDecimal initialBalance;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
