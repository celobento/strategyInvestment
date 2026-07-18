package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchCategoryResponseDTO;
import br.com.systemit.strategyInvestment.strategy.repository.CountryRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class CategoryMapper {

    @Autowired
    CountryRepository countryRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "country", expression = "java( dto.countryId() != null ? countryRepository.findById(dto.countryId()).orElse(null) : null )")
    public abstract Category toEntity(CategoryCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "country", expression = "java( dto.countryId() != null ? countryRepository.findById(dto.countryId()).orElse(null) : null )")
    public abstract Category toEntity(CategoryUpdateRequestDTO dto);

    @Mapping(target = "countryId", source = "country.id")
    @Mapping(target = "countryName", source = "country.name")
    @Mapping(target = "countryAcronym", source = "country.acronym")
    public abstract CategoryCreateResponseDTO toDtoCreateResponse(Category category);

    @Mapping(target = "countryId", source = "country.id")
    @Mapping(target = "countryName", source = "country.name")
    @Mapping(target = "countryAcronym", source = "country.acronym")
    public abstract SearchCategoryResponseDTO toDtoSearchCategoryResponse(Category category);

}
