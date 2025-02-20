package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SectorUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchSectorResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SectorMapper {

    Sector toEntity(SectorCreateRequestDTO dto);

    Sector toEntity(SectorUpdateRequestDTO dto);

    SectorCreateRequestDTO toDto(Sector sector);

    SectorCreateResponseDTO toDtoCreateResponse(Sector sector);

    SearchSectorResponseDTO toDtoSearchSectorResponse(Sector sector);

}
