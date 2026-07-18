package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.WalletStrategy;
import br.com.systemit.strategyInvestment.strategy.repository.CategoryRepository;
import br.com.systemit.strategyInvestment.strategy.repository.WalletRepository;
import br.com.systemit.strategyInvestment.strategy.repository.WalletStrategyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletStrategyService {

    private final WalletStrategyRepository walletStrategyRepository;
    private final WalletRepository walletRepository;
    private final CategoryRepository categoryRepository;

    public List<WalletStrategy> findByWalletId(Integer walletId) {
        return walletStrategyRepository.findByWalletId(walletId);
    }

    public WalletStrategy add(Integer walletId, Integer categoryId, BigDecimal percent) {
        if (walletStrategyRepository.existsByWalletIdAndCategoryId(walletId, categoryId)) {
            throw new IllegalStateException("Category already in strategy");
        }
        Wallet wallet = walletRepository.getReferenceById(walletId);
        Category category = categoryRepository.getReferenceById(categoryId);
        WalletStrategy ws = new WalletStrategy();
        ws.setWallet(wallet);
        ws.setCategory(category);
        ws.setPercent(percent);
        return walletStrategyRepository.save(ws);
    }

    public WalletStrategy updatePercent(Integer walletStrategyId, BigDecimal percent) {
        WalletStrategy ws = walletStrategyRepository.findById(walletStrategyId)
                .orElseThrow(() -> new IllegalArgumentException("Strategy not found"));
        ws.setPercent(percent);
        return walletStrategyRepository.save(ws);
    }

    public void remove(Integer walletStrategyId) {
        walletStrategyRepository.deleteById(walletStrategyId);
    }
}
