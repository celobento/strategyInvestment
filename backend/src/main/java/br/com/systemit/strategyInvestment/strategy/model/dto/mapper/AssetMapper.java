package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.repository.CategoryRepository;
import br.com.systemit.strategyInvestment.strategy.repository.CountryRepository;
import br.com.systemit.strategyInvestment.strategy.repository.SectorRepository;
import br.com.systemit.strategyInvestment.strategy.repository.SegmentRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = CountryMapper.class)
public abstract class AssetMapper {

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    SectorRepository sectorRepository;

    @Autowired
    SegmentRepository segmentRepository;

    @Mapping(target = "country", expression = "java( countryRepository.findById(dto.country()).orElse(null)) ")
    @Mapping(target = "category", expression = "java( categoryRepository.findById(dto.category()).orElse(null)) ")
    @Mapping(target = "sector", expression = "java( sectorRepository.findById(dto.sector()).orElse(null)) ")
    @Mapping(target = "segment", expression = "java( segmentRepository.findById(dto.segment()).orElse(null)) ")
    public abstract Asset toEntity(AssetCreateRequestDTO dto);

    //Asset toEntity(AssetUpdateRequestDTO dto);

    //public abstract AssetCreateRequestDTO toDto(Asset asset);

    public abstract AssetCreateResponseDTO toDtoCreateResponse(Asset asset);

    //SearchAssetResponseDTO toDtoSearchAssetResponse(Asset asset);

}
