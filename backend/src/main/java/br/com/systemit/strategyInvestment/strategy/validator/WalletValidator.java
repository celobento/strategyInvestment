package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.dto.Validations;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.repository.WalletRepository;
import jakarta.validation.Validation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class WalletValidator {

    private final WalletRepository walletRepository;

    public Optional<Wallet> validateNameIdUserExists(String name, User user) {
        return walletRepository.findByNameAndUser(name,user);
    }

    private Optional<Wallet> validateIdExists(Integer id) {
        Optional<Wallet> walletOptional = walletRepository.findById(id);
        if(walletOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
        return walletOptional;
    }

    public Optional<Wallet> validateDeleteWallet(Integer id) {
        return validateIdExists(id);
    }

    public void validateCreateWallet(Wallet wallet) {
        validateUser(wallet);
        validateWalletAlreadyExists(wallet);
    }

    private void validateWalletAlreadyExists(Wallet wallet) {
        Optional<Wallet> walletOptional = validateNameIdUserExists(wallet.getName(), wallet.getUser());
        if(!walletOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    private void validateUser(Wallet wallet) {

        if(wallet.getUser() == null || wallet.getUser().getId() == null){
            Validations validation = new Validations("Invalid user", "null");
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND, validation);
        }
    }
}
