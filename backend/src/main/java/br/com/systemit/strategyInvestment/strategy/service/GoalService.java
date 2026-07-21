package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Goal;
import br.com.systemit.strategyInvestment.strategy.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository repository;

    public List<Goal> findAll() {
        return repository.findAllByOrderByLimitDateAsc();
    }

    public Optional<Goal> findById(Integer id) {
        return repository.findById(id);
    }

    public Goal create(Goal goal) {
        return repository.save(goal);
    }

    public Goal update(Goal goal) {
        return repository.save(goal);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
