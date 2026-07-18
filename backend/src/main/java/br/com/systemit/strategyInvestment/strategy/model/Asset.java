package br.com.systemit.strategyInvestment.strategy.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tb_asset", schema = "strategy")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "ticket", nullable = false, length = 10)
    private String ticket;

    @Column(name = "description", nullable = true, length = 250)
    private String description;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private Country country;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "sector_id", referencedColumnName = "id")
    private Sector sector;

    @ManyToOne
    @JoinColumn(name = "segment_id", referencedColumnName = "id")
    private Segment segment;

    @ManyToOne
    @JoinColumn(name = "asset_type_id", referencedColumnName = "id")
    private AssetType assetType;

    @Enumerated(EnumType.STRING)
    @Column(name = "income_type", length = 20)
    private IncomeType incomeType;

    @Column(name = "ceiling_price", precision = 16, scale = 2)
    private BigDecimal ceilingPrice;

    @Column(name = "nav_estimated", precision = 16, scale = 2)
    private BigDecimal navEstimated;

    @Column(name = "premium_discount", precision = 16, scale = 4)
    private BigDecimal premiumDiscount;

    @Column(name = "indicator", length = 20)
    private String indicator;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedDate;

}
