package br.com.systemit.strategyInvestment.auth.validator;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.repository.UserRepository;
import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserValidator {

    private final UserRepository userRepository;

    private Optional<User> validateIdExists(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
        return userOptional;
    }

    public Optional<User> validateDeleteUser(Integer id) {
        return validateIdExists(id);
    }
}
