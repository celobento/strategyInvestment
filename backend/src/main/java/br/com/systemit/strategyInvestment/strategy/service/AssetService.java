package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import br.com.systemit.strategyInvestment.strategy.validator.AssetValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetValidator validator;

    public Asset save(Asset asset) {
        validator.validateNewAsset(asset);
        return assetRepository.save(asset);
    }

    public void delete(Integer id) {
        Optional<Asset> assetOptional = validator.validateDeleteAsset(id);
        assetRepository.delete(assetOptional.get());
    }
}
