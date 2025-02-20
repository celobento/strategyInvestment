package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;
}
