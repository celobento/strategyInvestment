package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.FiiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FiiAnalysisRepository extends JpaRepository<FiiAnalysis, Integer> {

    List<FiiAnalysis> findAllByOrderBySegmentoAscPrecoValorPatrimonialAsc();

    List<FiiAnalysis> findBySegmentoIgnoreCaseOrderByPrecoValorPatrimonialAsc(String segmento);

    Optional<FiiAnalysis> findFirstByTicketIgnoreCaseOrderByIdDesc(String ticket);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM public.fii_analysi WHERE UPPER(ticket) = UPPER(:ticket)", nativeQuery = true)
    void deleteAllByTicket(@Param("ticket") String ticket);
}
