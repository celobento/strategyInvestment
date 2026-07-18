package br.com.systemit.strategyInvestment.strategy.service;

import org.springframework.stereotype.Service;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.repository.CountryRepository;
import br.com.systemit.strategyInvestment.strategy.validator.CountryValidator;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;
    private final CountryValidator validator;

    public Optional<Country> findById(Integer id) {
        return countryRepository.findById(id);
    }

    public List<Country> search(String name) {
        if (name != null && !name.isEmpty()) {
            return countryRepository.findByNameContainingIgnoreCase(name);
        }
        return countryRepository.findAll();
    }

    public Country save(Country country) {
        validator.validateNewCountry(country);
        return countryRepository.save(country);
    }
}
