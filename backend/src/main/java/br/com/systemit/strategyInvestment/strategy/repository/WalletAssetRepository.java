package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.WalletAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalletAssetRepository extends JpaRepository<WalletAsset, Integer> {
    List<WalletAsset> findByWalletId(Integer walletId);
    Optional<WalletAsset> findByWalletIdAndAssetId(Integer walletId, Integer assetId);
    boolean existsByWalletIdAndAssetId(Integer walletId, Integer assetId);
}
