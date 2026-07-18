package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetRecommendationUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchAssetResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.AssetMapper;
import br.com.systemit.strategyInvestment.strategy.service.AssetService;
import br.com.systemit.strategyInvestment.util.JsonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("assets")
@RequiredArgsConstructor
@Tag(name = "Asset")
public class AssetController {

    private final AssetService assetService;
    private final AssetMapper assetMapper;

    @GetMapping
    @Operation(summary = "Search assets", description = "List all assets or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchAssetResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<Asset> result = assetService.search(name);
        List<SearchAssetResponseDTO> response = result.stream()
                .map(assetMapper::toDtoSearchAssetResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get asset by ID", description = "Find a single asset by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return assetService.findById(id)
                .map(asset -> {
                    SearchAssetResponseDTO dto = assetMapper.toDtoSearchAssetResponse(asset);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    @Operation( summary = "Create asset", description = "Endpoint to create a new asset")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to create new asset")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid AssetCreateRequestDTO dto) {
        Asset asset = assetMapper.toEntity(dto);
        asset = assetService.save(asset);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(assetMapper.toDtoCreateResponse(asset));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update asset", description = "Endpoint to update an existing asset")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<Object> update(
            @PathVariable("id") Integer id,
            @RequestBody @Valid AssetCreateRequestDTO dto) {
        Asset asset = assetMapper.toEntity(dto);
        asset.setId(id);
        asset = assetService.update(asset);
        return ResponseEntity.ok(assetMapper.toDtoSearchAssetResponse(asset));
    }

    @PatchMapping("/{id}/recommendation")
    @Operation(summary = "Update asset recommendation fields", description = "Updates ceiling price, NAV, premium/discount and indicator")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<Object> updateRecommendation(
            @PathVariable("id") Integer id,
            @RequestBody AssetRecommendationUpdateRequestDTO dto) {
        return assetService.findById(id)
                .map(asset -> {
                    asset.setCeilingPrice(dto.ceilingPrice());
                    asset.setNavEstimated(dto.navEstimated());
                    asset.setPremiumDiscount(dto.premiumDiscount());
                    asset.setIndicator(dto.indicator());
                    asset = assetService.update(asset);
                    return ResponseEntity.ok((Object) assetMapper.toDtoSearchAssetResponse(asset));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation( summary = "Delete asset", description = "Endpoint to delete a asset")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a asset")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id){
        assetService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
