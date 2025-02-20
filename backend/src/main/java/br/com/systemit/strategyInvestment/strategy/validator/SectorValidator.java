package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SectorValidator {

    private final SectorRepository sectorRepository;

    public void validateNewSector(Sector sector){
        if(sectorNameExists(sector)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    private boolean sectorNameExists(Sector sector) {
        Optional<Sector> sectorTemp = sectorRepository.findByNameIgnoreCase(sector.getName());
        return sectorTemp.isPresent();

    }

    public void validateUpdateSector(Sector sector) {
        validateIdExists(sector.getId());
    }

    private void validateIdExists(Integer id) {
        Optional<Sector> sectorOptional = sectorRepository.findById(id);
        if(sectorOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
    }

    public Optional<Sector> validateDeleteSector(Integer id) {
        Optional<Sector> sectorOptional = sectorRepository.findById(id);
        validateIdExists(id);
        return sectorOptional;
    }
}
