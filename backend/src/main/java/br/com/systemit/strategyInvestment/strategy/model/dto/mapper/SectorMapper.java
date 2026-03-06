package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchSectorResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorUpdateRequestDTO;

@Mapper(componentModel = "spring")
public interface SectorMapper {

    @Mapping(target = "id", ignore = true)
    Sector toEntity(SectorCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    Sector toEntity(SectorUpdateRequestDTO dto);

    SectorCreateRequestDTO toDto(Sector sector);

    SectorCreateResponseDTO toDtoCreateResponse(Sector sector);

    SearchSectorResponseDTO toDtoSearchSectorResponse(Sector sector);

}
