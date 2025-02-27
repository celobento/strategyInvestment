package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AssetValidator {

    private final AssetRepository assetRepository;

    public void validateNewAsset(Asset asset){
        if(assetNameExists(asset)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    private boolean assetNameExists(Asset asset) {
        Optional<Asset> assetTemp = assetRepository.findByTicketIgnoreCase(asset.getTicket());
        return assetTemp.isPresent();

    }

    public void validateUpdateAsset(Asset asset) {
        validateIdExists(asset.getId());
    }

    private Optional<Asset> validateIdExists(Integer id) {
        Optional<Asset> assetOptional = assetRepository.findById(id);
        if(assetOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
        return assetOptional;
    }

    public Optional<Asset> validateDeleteAsset(Integer id) {
        return validateIdExists(id);
    }
}
