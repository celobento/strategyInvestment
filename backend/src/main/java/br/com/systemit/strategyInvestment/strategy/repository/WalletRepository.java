package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {

    Optional<Wallet> findByNameAndUser(String name, User user);
}
