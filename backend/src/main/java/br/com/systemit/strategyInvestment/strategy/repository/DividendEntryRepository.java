package br.com.systemit.strategyInvestment.strategy.repository;

import br.com.systemit.strategyInvestment.strategy.model.DividendEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DividendEntryRepository extends JpaRepository<DividendEntry, Integer> {

    List<DividendEntry> findByYearOrderByMonthAscCategoryAsc(Integer year);

    List<DividendEntry> findAllByOrderByYearDescMonthDescCategoryAsc();
}
