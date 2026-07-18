package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchCountryResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CountryMapper {

    @org.mapstruct.Mapping(target = "id", ignore = true)
    Country toEntity(CountryCreateRequestDTO dto);

    CountryCreateResponseDTO toDtoCreateResponse(Country country);

    SearchCountryResponseDTO toDtoSearchCountryResponse(Country country);

}
