package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.WalletAsset;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import br.com.systemit.strategyInvestment.strategy.repository.WalletAssetRepository;
import br.com.systemit.strategyInvestment.strategy.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletAssetService {

    private final WalletAssetRepository walletAssetRepository;
    private final WalletRepository walletRepository;
    private final AssetRepository assetRepository;

    public List<WalletAsset> findByWalletId(Integer walletId) {
        return walletAssetRepository.findByWalletId(walletId);
    }

    public WalletAsset add(Integer walletId, Integer assetId) {
        if (walletAssetRepository.existsByWalletIdAndAssetId(walletId, assetId)) {
            throw new IllegalStateException("Asset already in wallet");
        }
        Wallet wallet = walletRepository.getReferenceById(walletId);
        Asset asset = assetRepository.getReferenceById(assetId);
        WalletAsset wa = new WalletAsset();
        wa.setWallet(wallet);
        wa.setAsset(asset);
        return walletAssetRepository.save(wa);
    }

    public WalletAsset updatePosition(Integer walletAssetId, BigDecimal quantity, BigDecimal mediumPrice, BigDecimal currentPrice) {
        WalletAsset wa = walletAssetRepository.findById(walletAssetId)
                .orElseThrow(() -> new IllegalArgumentException("WalletAsset not found"));
        wa.setQuantity(quantity);
        wa.setMediumPrice(mediumPrice);
        wa.setCurrentPrice(currentPrice);
        return walletAssetRepository.save(wa);
    }

    public List<WalletAsset> findAll() {
        return walletAssetRepository.findAll();
    }

    public void remove(Integer walletAssetId) {
        walletAssetRepository.deleteById(walletAssetId);
    }
}
