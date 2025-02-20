package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Integer> {
}
