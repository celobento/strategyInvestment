package br.com.systemit.strategyInvestment.strategy.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.systemit.strategyInvestment.strategy.model.Asset;

public interface AssetRepository extends JpaRepository<Asset, Integer> {

    Optional<Asset> findByTicketIgnoreCase(String ticket);

    List<Asset> findByNameContainingIgnoreCase(String name);

    @Modifying
    @Transactional
    @Query("UPDATE Asset a SET a.dividendYield = :yield WHERE UPPER(a.ticket) = UPPER(:ticket)")
    int updateDividendYieldByTicket(@Param("ticket") String ticket, @Param("yield") BigDecimal yield);

}
