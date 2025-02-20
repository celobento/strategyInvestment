package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.Revision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RevisionRepository extends JpaRepository<Revision, Integer> {

}
