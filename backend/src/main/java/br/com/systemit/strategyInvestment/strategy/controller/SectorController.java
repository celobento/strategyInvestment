package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.SectorMapper;
import br.com.systemit.strategyInvestment.strategy.service.SectorService;
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
@RequestMapping("sectors")
@RequiredArgsConstructor
@Tag(name = "Sector")
public class SectorController {

    private final SectorService sectorService;
    private final SectorMapper sectorMapper;

    @PostMapping
    @Operation( summary = "Create sector", description = "Endpoint to create a new sector")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to create new sector")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid SectorCreateRequestDTO dto) {
        Sector sector = sectorMapper.toEntity(dto);
        sector = sectorService.salvar(sector);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(sectorMapper.toDtoCreateResponse(sector));
    }
    
    @DeleteMapping("/{id}")
    @Operation( summary = "Delete sector", description = "Endpoint to delete a sector")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a sector")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id){
        sectorService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
