package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.WalletStrategy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletStrategyRepository extends JpaRepository<WalletStrategy, Integer> {
    List<WalletStrategy> findByWalletId(Integer walletId);
    boolean existsByWalletIdAndCategoryId(Integer walletId, Integer categoryId);
}
