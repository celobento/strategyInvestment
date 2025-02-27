package br.com.systemit.strategyInvestment.strategy.model;

import br.com.systemit.strategyInvestment.auth.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

}
