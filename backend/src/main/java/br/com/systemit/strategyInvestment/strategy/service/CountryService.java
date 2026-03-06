package br.com.systemit.strategyInvestment.strategy.service;

import org.springframework.stereotype.Service;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.repository.CountryRepository;
import br.com.systemit.strategyInvestment.strategy.validator.CountryValidator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;
    private final CountryValidator validator;

    public Country save(Country country) {
        validator.validateNewCountry(country);
        return countryRepository.save(country);
    }
}
