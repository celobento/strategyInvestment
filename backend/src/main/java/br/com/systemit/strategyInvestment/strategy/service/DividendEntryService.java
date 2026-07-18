package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.DividendEntry;
import br.com.systemit.strategyInvestment.strategy.repository.DividendEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DividendEntryService {

    private final DividendEntryRepository repository;

    public List<DividendEntry> findAll() {
        return repository.findAllByOrderByYearDescMonthDescCategoryAsc();
    }

    public List<DividendEntry> findByYear(Integer year) {
        return repository.findByYearOrderByMonthAscCategoryAsc(year);
    }

    public Optional<DividendEntry> findById(Integer id) {
        return repository.findById(id);
    }

    public DividendEntry create(DividendEntry entry) {
        return repository.save(entry);
    }

    public DividendEntry update(DividendEntry entry) {
        return repository.save(entry);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
