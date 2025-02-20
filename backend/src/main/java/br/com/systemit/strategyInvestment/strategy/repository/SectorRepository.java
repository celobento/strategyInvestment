package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.Sector;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SectorRepository extends JpaRepository<Sector, Integer> {

    Optional<Sector> findByNameIgnoreCase(String name);

}
