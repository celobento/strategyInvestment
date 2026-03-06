package br.com.systemit.strategyInvestment.strategy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.systemit.strategyInvestment.strategy.model.Revision;

public interface RevisionRepository extends JpaRepository<Revision, Integer> {

}
