package br.com.systemit.strategyInvestment.strategy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.CountryMapper;
import br.com.systemit.strategyInvestment.strategy.service.CountryService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("countries")
@RequiredArgsConstructor
@Tag(name = "Country")
public class CountryController {

    private final CountryService countryService;
    private final CountryMapper countryMapper;

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
