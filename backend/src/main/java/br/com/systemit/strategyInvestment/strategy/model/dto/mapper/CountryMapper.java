package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.dto.CountryCreateRequestDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CountryMapper {

    Country toEntity(CountryCreateRequestDTO dto);

    //Country toEntity(CountryUpdateRequestDTO dto);

    CountryCreateRequestDTO toDto(Country country);

    //CountryCreateResponseDTO toDtoCreateResponse(Country country);

    //SearchCountryResponseDTO toDtoSearchCountryResponse(Country country);

}
