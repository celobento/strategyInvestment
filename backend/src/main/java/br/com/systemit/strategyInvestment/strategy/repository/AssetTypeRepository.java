package br.com.systemit.strategyInvestment.strategy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.systemit.strategyInvestment.strategy.model.AssetType;

public interface AssetTypeRepository extends JpaRepository<AssetType, Integer> {

    Optional<AssetType> findByNameIgnoreCase(String name);

    List<AssetType> findByNameContainingIgnoreCase(String name);

}
