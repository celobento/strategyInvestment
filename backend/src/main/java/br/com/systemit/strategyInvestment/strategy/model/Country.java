package br.com.systemit.strategyInvestment.strategy.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_country", schema = "strategy")
@Data
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "acronym", nullable = false, length = 3)
    private String acronym;

}
