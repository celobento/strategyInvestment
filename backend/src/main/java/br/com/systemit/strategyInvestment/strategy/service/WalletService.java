package br.com.systemit.strategyInvestment.strategy.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.repository.WalletRepository;
import br.com.systemit.strategyInvestment.strategy.validator.WalletValidator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletValidator validator;

    public Optional<Wallet> findById(Integer id) {
        return walletRepository.findById(id);
    }

    public List<Wallet> search(String name) {
        if (name != null && !name.isEmpty()) {
            return walletRepository.findByNameContainingIgnoreCase(name);
        }
        return walletRepository.findAll();
    }

    public Wallet save(Wallet wallet) {
        validator.validateCreateWallet(wallet);
        wallet.setCurrentValue(BigDecimal.ZERO);
        wallet.setDividendYeld(BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    public Wallet updateMinAssetPays(Integer id, BigDecimal minAssetPays) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        wallet.setMinAssetPays(minAssetPays);
        return walletRepository.save(wallet);
    }

    public void delete(Integer id) {
        Optional<Wallet> walletOptional = validator.validateDeleteWallet(id);
        walletRepository.delete(walletOptional.get());
    }
}
