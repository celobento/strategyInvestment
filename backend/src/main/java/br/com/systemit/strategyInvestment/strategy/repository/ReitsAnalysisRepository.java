package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.ReitsAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReitsAnalysisRepository extends JpaRepository<ReitsAnalysis, Integer> {

    List<ReitsAnalysis> findAllByOrderBySectorAscTicketAsc();

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM strategy.reits_analysi WHERE UPPER(ticket) = UPPER(:ticket)", nativeQuery = true)
    void deleteAllByTicket(@Param("ticket") String ticket);
}
