package br.com.systemit.strategyInvestment.strategy.service;

import org.springframework.stereotype.Service;

import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.repository.SectorRepository;
import br.com.systemit.strategyInvestment.strategy.validator.SectorValidator;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SectorService {

    private final SectorRepository sectorRepository;
    private final SectorValidator validator;

    public Optional<Sector> findById(Integer id) {
        return sectorRepository.findById(id);
    }

    public List<Sector> search(String name) {
        if (name != null && !name.isEmpty()) {
            return sectorRepository.findByNameContainingIgnoreCase(name);
        }
        return sectorRepository.findAll();
    }

    public void delete(Integer id) {
        Sector sector = sectorRepository.getReferenceById(id);
        sectorRepository.delete(sector);
    }

    public Sector salvar(Sector sector) {
        validator.validateNewSector(sector);
        return sectorRepository.save(sector);
    }
}
