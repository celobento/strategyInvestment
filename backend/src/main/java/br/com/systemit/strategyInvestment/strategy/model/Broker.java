package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_broker", schema = "strategy")
@Data
public class Broker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "website", nullable = false, length = 250)
    private String webSite;

}
