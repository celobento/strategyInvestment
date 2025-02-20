package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import br.com.systemit.strategyInvestment.strategy.validator.AssetValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetValidator validator;

    public Asset save(Asset asset) {
        validator.validateNewAsset(asset);
        return assetRepository.save(asset);
    }
}
