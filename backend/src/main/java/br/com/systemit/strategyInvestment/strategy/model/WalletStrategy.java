package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "tb_wallet_strategy",
    schema = "strategy",
    uniqueConstraints = @UniqueConstraint(columnNames = {"wallet_id", "category_id"})
)
@Data
@EntityListeners(AuditingEntityListener.class)
public class WalletStrategy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal percent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
