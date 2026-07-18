package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.AssetType;
import br.com.systemit.strategyInvestment.strategy.repository.AssetTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AssetTypeValidator {

    private final AssetTypeRepository assetTypeRepository;

    public void validateNew(AssetType assetType) {
        if (nameExists(assetType.getName(), null)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    public void validateUpdate(AssetType assetType) {
        validateIdExists(assetType.getId());
        if (nameExists(assetType.getName(), assetType.getId())) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    public void validateDelete(Integer id) {
        validateIdExists(id);
    }

    private boolean nameExists(String name, Integer excludeId) {
        Optional<AssetType> found = assetTypeRepository.findByNameIgnoreCase(name);
        return found.isPresent() && !found.get().getId().equals(excludeId);
    }

    private void validateIdExists(Integer id) {
        if (assetTypeRepository.findById(id).isEmpty()) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
    }

}
