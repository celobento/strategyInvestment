package br.com.systemit.strategyInvestment.auth.service;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.repository.UserRepository;
import br.com.systemit.strategyInvestment.auth.validator.UserValidator;
import br.com.systemit.strategyInvestment.strategy.model.Revision;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserValidator validator;
    private final PasswordEncoder encoder;

    public User save(User user) {
        var passTemp = encoder.encode(user.getPassword());
        user.setPassword(passTemp);
        user.setLastPassword(passTemp);
        user.setFirstAccess(Boolean.TRUE);
        return userRepository.save(user);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void delete(Integer id) {
        Optional<User> assetOptional = validator.validateDeleteUser(id);
        userRepository.delete(assetOptional.get());
    }
}
