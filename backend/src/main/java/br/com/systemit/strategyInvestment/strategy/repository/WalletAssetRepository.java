package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.WalletAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WalletAssetRepository extends JpaRepository<WalletAsset, Integer> {
    List<WalletAsset> findByWalletId(Integer walletId);
    Optional<WalletAsset> findByWalletIdAndAssetId(Integer walletId, Integer assetId);
    boolean existsByWalletIdAndAssetId(Integer walletId, Integer assetId);

    @Query("SELECT DISTINCT wa.asset.ticket FROM WalletAsset wa WHERE wa.asset.category.id = 2 ORDER BY wa.asset.ticket ASC")
    List<String> findDistinctFiiTickets();
}
