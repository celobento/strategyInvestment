package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchCategoryResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    Category toEntity(CategoryCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    Category toEntity(CategoryUpdateRequestDTO dto);

    CategoryCreateRequestDTO toDto(Category category);

    CategoryCreateResponseDTO toDtoCreateResponse(Category category);

    SearchCategoryResponseDTO toDtoSearchCategoryResponse(Category category);

}
