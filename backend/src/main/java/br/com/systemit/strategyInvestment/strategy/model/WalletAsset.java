package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "tb_wallet_asset",
    schema = "strategy",
    uniqueConstraints = @UniqueConstraint(columnNames = {"wallet_id", "asset_id"})
)
@Data
@EntityListeners(AuditingEntityListener.class)
public class WalletAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreatedDate
    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "quantity", precision = 20, scale = 8)
    private BigDecimal quantity;

    @Column(name = "medium_price", precision = 16, scale = 2)
    private BigDecimal mediumPrice;

    @Column(name = "current_price", precision = 16, scale = 2)
    private BigDecimal currentPrice;
}
