package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.Segment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SegmentRepository extends JpaRepository<Segment, Integer> {

    Optional<Segment> findByNameIgnoreCase(String name);

}
