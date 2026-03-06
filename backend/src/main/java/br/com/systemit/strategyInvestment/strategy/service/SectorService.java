package br.com.systemit.strategyInvestment.strategy.service;

import org.springframework.stereotype.Service;

import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.repository.SectorRepository;
import br.com.systemit.strategyInvestment.strategy.validator.SectorValidator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SectorService {

    private final SectorRepository sectorRepository;
    private final SectorValidator validator;

    public void delete(Integer id) {
        Sector sector = sectorRepository.getReferenceById(id);
        sectorRepository.delete(sector);
    }

    public Sector salvar(Sector sector) {
        validator.validateNewSector(sector);
        return sectorRepository.save(sector);
    }
}
