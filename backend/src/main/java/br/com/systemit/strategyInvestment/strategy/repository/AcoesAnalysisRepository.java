package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.AcoesAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface AcoesAnalysisRepository extends JpaRepository<AcoesAnalysis, Integer> {

    List<AcoesAnalysis> findAllByOrderBySetorAscSegmentoAscTicketAsc();

    Optional<AcoesAnalysis> findFirstByTicketIgnoreCaseOrderByIdDesc(String ticket);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM strategy.acoes_analysi WHERE UPPER(ticket) = UPPER(:ticket)", nativeQuery = true)
    void deleteAllByTicket(@Param("ticket") String ticket);
}
