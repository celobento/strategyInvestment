package br.com.systemit.strategyInvestment.strategy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.systemit.strategyInvestment.strategy.model.Segment;

public interface SegmentRepository extends JpaRepository<Segment, Integer> {

    Optional<Segment> findByNameIgnoreCase(String name);

}
