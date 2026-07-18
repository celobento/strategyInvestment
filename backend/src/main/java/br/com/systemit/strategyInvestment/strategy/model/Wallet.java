package br.com.systemit.strategyInvestment.strategy.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import br.com.systemit.strategyInvestment.auth.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tb_wallet", schema = "strategy")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @CreatedDate
    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "current_value", nullable = false, precision = 16, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "dividend_yeld", nullable = false, precision = 16, scale = 2)
    private BigDecimal dividendYeld;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "min_asset_pays", nullable = true, precision = 16, scale = 2)
    private BigDecimal minAssetPays;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

}
