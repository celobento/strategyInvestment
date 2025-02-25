package br.com.systemit.strategyInvestment.auth.repository;

import br.com.systemit.strategyInvestment.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
