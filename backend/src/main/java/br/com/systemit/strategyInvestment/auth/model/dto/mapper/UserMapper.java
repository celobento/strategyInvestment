package br.com.systemit.strategyInvestment.auth.model.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.model.dto.UserCreateRequestDTO;
import br.com.systemit.strategyInvestment.auth.model.dto.UserCreateResponseDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", source = "roles")
    User toEntity(UserCreateRequestDTO dto);

    @Mapping(target = "roles", source = "roles")
    UserCreateResponseDTO toDtoCreateResponse(User user);

}
