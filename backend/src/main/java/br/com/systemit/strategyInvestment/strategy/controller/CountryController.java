package br.com.systemit.strategyInvestment.strategy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchCountryResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.CountryMapper;
import br.com.systemit.strategyInvestment.strategy.service.CountryService;
import br.com.systemit.strategyInvestment.util.JsonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("countries")
@RequiredArgsConstructor
@Tag(name = "Country")
public class CountryController {

    private final CountryService countryService;
    private final CountryMapper countryMapper;

    @GetMapping
    @Operation(summary = "Search countries", description = "List all countries or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchCountryResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<Country> result = countryService.search(name);
        List<SearchCountryResponseDTO> response = result.stream()
                .map(countryMapper::toDtoSearchCountryResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get country by ID", description = "Find a single country by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return countryService.findById(id)
                .map(country -> {
                    SearchCountryResponseDTO dto = countryMapper.toDtoSearchCountryResponse(country);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    public ResponseEntity<CountryCreateResponseDTO> save(@RequestBody @Valid CountryCreateRequestDTO dto) {
        Country country = countryMapper.toEntity(dto);
        country = countryService.save(country);
        CountryCreateResponseDTO response = countryMapper.toDtoCreateResponse(country);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

}
