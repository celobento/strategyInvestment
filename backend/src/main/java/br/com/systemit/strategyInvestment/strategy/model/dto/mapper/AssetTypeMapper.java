package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.AssetType;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetTypeCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetTypeCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.AssetTypeUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchAssetTypeResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssetTypeMapper {

    @Mapping(target = "id", ignore = true)
    AssetType toEntity(AssetTypeCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    AssetType toEntity(AssetTypeUpdateRequestDTO dto);

    AssetTypeCreateResponseDTO toDtoCreateResponse(AssetType assetType);

    SearchAssetTypeResponseDTO toDtoSearchResponse(AssetType assetType);

}
