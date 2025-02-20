package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Integer> {
}
