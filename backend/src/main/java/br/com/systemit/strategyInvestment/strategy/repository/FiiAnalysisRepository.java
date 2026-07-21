package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.FiiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FiiAnalysisRepository extends JpaRepository<FiiAnalysis, Integer> {

    List<FiiAnalysis> findAllByOrderBySegmentoAscPrecoValorPatrimonialAsc();

    List<FiiAnalysis> findBySegmentoIgnoreCaseOrderByPrecoValorPatrimonialAsc(String segmento);
}
