package br.com.systemit.strategyInvestment.strategy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.systemit.strategyInvestment.strategy.model.Sector;

public interface SectorRepository extends JpaRepository<Sector, Integer> {

    Optional<Sector> findByNameIgnoreCase(String name);

}
