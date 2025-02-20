package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.service.CountryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("countries")
@RequiredArgsConstructor
@Tag(name = "Country")
public class CountryController {

    private final CountryService countryService;

}
