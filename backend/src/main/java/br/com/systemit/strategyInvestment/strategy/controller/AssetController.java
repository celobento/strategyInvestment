package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.AssetMapper;
import br.com.systemit.strategyInvestment.strategy.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;
    private final AssetMapper assetMapper;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody @Valid AssetCreateRequestDTO dto) {
        Asset asset = assetMapper.toEntity(dto);
        asset = assetService.save(asset);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(assetMapper.toDtoCreateResponse(asset));
    }


}
