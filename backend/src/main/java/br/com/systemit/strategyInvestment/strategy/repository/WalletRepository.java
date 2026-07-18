package br.com.systemit.strategyInvestment.strategy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {

    Optional<Wallet> findByNameAndUser(String name, User user);

    List<Wallet> findByNameContainingIgnoreCase(String name);
}
