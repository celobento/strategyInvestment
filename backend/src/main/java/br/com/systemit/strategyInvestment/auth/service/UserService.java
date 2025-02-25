package br.com.systemit.strategyInvestment.auth.service;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
//    private final PasswordEncoder encoder;

    public User save(User user) {
//        var passTemp = encoder.encode(user.getPassword());
//        user.setPassword(passTemp);
//        user.setLastPassword(passTemp);
        user.setFirstAccess(Boolean.TRUE);
        return userRepository.save(user);
    }
}
