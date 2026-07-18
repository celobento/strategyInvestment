package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.AssetType;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetTypeCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetTypeUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchAssetTypeResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.AssetTypeMapper;
import br.com.systemit.strategyInvestment.strategy.service.AssetTypeService;
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
@RequestMapping("asset-types")
@RequiredArgsConstructor
@Tag(name = "AssetType")
public class AssetTypeController {

    private final AssetTypeService assetTypeService;
    private final AssetTypeMapper assetTypeMapper;

    @GetMapping
    @Operation(summary = "Search asset types", description = "List all asset types or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchAssetTypeResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<AssetType> result = assetTypeService.search(name);
        List<SearchAssetTypeResponseDTO> response = result.stream()
                .map(assetTypeMapper::toDtoSearchResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get asset type by ID", description = "Find a single asset type by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return assetTypeService.findById(id)
                .map(at -> {
                    SearchAssetTypeResponseDTO dto = assetTypeMapper.toDtoSearchResponse(at);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    @Operation(summary = "Create asset type", description = "Endpoint to create a new asset type")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid AssetTypeCreateRequestDTO dto) {
        AssetType assetType = assetTypeMapper.toEntity(dto);
        assetType = assetTypeService.save(assetType);
        return ResponseEntity.status(HttpStatus.CREATED).body(assetTypeMapper.toDtoCreateResponse(assetType));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update asset type", description = "Endpoint to update an existing asset type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<Object> update(@PathVariable("id") Integer id,
                                         @RequestBody @Valid AssetTypeUpdateRequestDTO dto) {
        AssetType assetType = assetTypeMapper.toEntity(dto);
        assetType.setId(id);
        assetType = assetTypeService.update(assetType);
        return ResponseEntity.ok(assetTypeMapper.toDtoSearchResponse(assetType));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete asset type", description = "Endpoint to delete an asset type")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id) {
        assetTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
