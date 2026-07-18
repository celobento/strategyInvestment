package br.com.systemit.strategyInvestment.strategy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.systemit.strategyInvestment.strategy.model.Asset;

public interface AssetRepository extends JpaRepository<Asset, Integer> {

    Optional<Asset> findByTicketIgnoreCase(String ticket);

    List<Asset> findByNameContainingIgnoreCase(String name);

}
