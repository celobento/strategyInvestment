package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.AssetMapper;
import br.com.systemit.strategyInvestment.strategy.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("assets")
@RequiredArgsConstructor
@Tag(name = "Asset")
public class AssetController {

    private final AssetService assetService;
    private final AssetMapper assetMapper;

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
