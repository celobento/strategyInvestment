package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Broker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrokerRepository extends JpaRepository<Broker, Integer> {
}
