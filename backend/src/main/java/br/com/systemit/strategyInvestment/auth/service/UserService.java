package br.com.systemit.strategyInvestment.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.repository.UserRepository;
import br.com.systemit.strategyInvestment.auth.validator.UserValidator;
import lombok.RequiredArgsConstructor;

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

    public List<User> search(String username, String email) {
        if (email != null && !email.isEmpty()) {
            return userRepository.findByEmail(email)
                    .map(List::of)
                    .orElse(List.of());
        }
        if (username != null && !username.isEmpty()) {
            return userRepository.findByUsernameContainingIgnoreCase(username);
        }
        return userRepository.findAll();
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void delete(Integer id) {
        Optional<User> assetOptional = validator.validateDeleteUser(id);
        userRepository.delete(assetOptional.get());
    }
}
