package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.model.dto.RevisionCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.RevisionCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.repository.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class RevisionMapper {

    @Autowired
    AssetRepository assetRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "PVp", source = "pVp")
    @Mapping(target = "asset", expression = "java( assetRepository.findById(dto.asset()).orElse(null)) ")
    public abstract Revision toEntity(RevisionCreateRequestDTO dto);

    //Revision toEntity(RevisionUpdateRequestDTO dto);

    //public abstract RevisionCreateRequestDTO toDto(Revision revision);

    @Mapping(target = "pVp", source = "PVp")
    public abstract RevisionCreateResponseDTO toDtoCreateResponse(Revision revision);

    //SearchRevisionResponseDTO toDtoSearchRevisionResponse(Revision revision);

}
