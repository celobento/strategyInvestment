package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CountryValidator {

    private final CountryRepository countryRepository;

    public void validateNewCountry(Country country) {
        if (countryNameExists(country)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
        if (countryAcronymExists(country)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    private boolean countryNameExists(Country country) {
        Optional<Country> existing = countryRepository.findByNameIgnoreCase(country.getName());
        return existing.isPresent();
    }

    private boolean countryAcronymExists(Country country) {
        Optional<Country> existing = countryRepository.findByAcronymIgnoreCase(country.getAcronym());
        return existing.isPresent();
    }
}
