package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchSectorResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.SectorMapper;
import br.com.systemit.strategyInvestment.strategy.service.SectorService;
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
@RequestMapping("sectors")
@RequiredArgsConstructor
@Tag(name = "Sector")
public class SectorController {

    private final SectorService sectorService;
    private final SectorMapper sectorMapper;

    @GetMapping
    @Operation(summary = "Search sectors", description = "List all sectors or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchSectorResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<Sector> result = sectorService.search(name);
        List<SearchSectorResponseDTO> response = result.stream()
                .map(sectorMapper::toDtoSearchSectorResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get sector by ID", description = "Find a single sector by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return sectorService.findById(id)
                .map(sector -> {
                    SearchSectorResponseDTO dto = sectorMapper.toDtoSearchSectorResponse(sector);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

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
