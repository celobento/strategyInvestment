package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Integer> {

    Optional<Country> findByNameIgnoreCase(String name);

    Optional<Country> findByAcronymIgnoreCase(String acronym);

    List<Country> findByNameContainingIgnoreCase(String name);
}
