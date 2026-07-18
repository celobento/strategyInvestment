package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Segment;
import br.com.systemit.strategyInvestment.strategy.repository.SegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SegmentService {

    private final SegmentRepository segmentRepository;

    public List<Segment> search(String name) {
        if (name != null && !name.isEmpty()) {
            return segmentRepository.findByNameContainingIgnoreCase(name);
        }
        return segmentRepository.findAll();
    }

    public Optional<Segment> findById(Integer id) {
        return segmentRepository.findById(id);
    }

}
