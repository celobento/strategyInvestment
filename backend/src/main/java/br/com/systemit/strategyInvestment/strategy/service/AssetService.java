package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
}
