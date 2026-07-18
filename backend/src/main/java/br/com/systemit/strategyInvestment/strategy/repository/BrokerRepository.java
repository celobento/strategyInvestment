package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Broker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrokerRepository extends JpaRepository<Broker, Integer> {

    Optional<Broker> findByNameIgnoreCase(String name);

    List<Broker> findByNameContainingIgnoreCase(String name);
}
