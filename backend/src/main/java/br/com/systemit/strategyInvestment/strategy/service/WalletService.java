package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.repository.WalletRepository;
import br.com.systemit.strategyInvestment.strategy.validator.WalletValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletValidator validator;

    public Wallet save(Wallet wallet) {
        validator.validateCreateWallet(wallet);
        wallet.setCurrentValue(BigDecimal.ZERO);
        wallet.setDividendYeld(BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    public void delete(Integer id) {
        Optional<Wallet> walletOptional = validator.validateDeleteWallet(id);
        walletRepository.delete(walletOptional.get());
    }
}
