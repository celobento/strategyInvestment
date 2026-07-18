package br.com.systemit.strategyInvestment.auth.repository;

import br.com.systemit.strategyInvestment.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    List<User> findByUsernameContainingIgnoreCase(String username);
    Optional<User> findByEmail(String email);
}
