package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

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

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedDate;

}
