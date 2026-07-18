package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.AssetType;
import br.com.systemit.strategyInvestment.strategy.repository.AssetTypeRepository;
import br.com.systemit.strategyInvestment.strategy.validator.AssetTypeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetTypeService {

    private final AssetTypeRepository assetTypeRepository;
    private final AssetTypeValidator validator;

    public Optional<AssetType> findById(Integer id) {
        return assetTypeRepository.findById(id);
    }

    public List<AssetType> search(String name) {
        if (name != null && !name.isEmpty()) {
            return assetTypeRepository.findByNameContainingIgnoreCase(name);
        }
        return assetTypeRepository.findAll();
    }

    public AssetType save(AssetType assetType) {
        validator.validateNew(assetType);
        return assetTypeRepository.save(assetType);
    }

    public AssetType update(AssetType assetType) {
        validator.validateUpdate(assetType);
        return assetTypeRepository.save(assetType);
    }

    public void delete(Integer id) {
        validator.validateDelete(id);
        assetTypeRepository.deleteById(id);
    }

}
