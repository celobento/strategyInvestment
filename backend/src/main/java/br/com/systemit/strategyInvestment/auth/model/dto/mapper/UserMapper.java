package br.com.systemit.strategyInvestment.auth.model.dto.mapper;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.model.dto.UserCreateRequestDTO;
import br.com.systemit.strategyInvestment.auth.model.dto.UserCreateResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(UserCreateRequestDTO dto);

    UserCreateResponseDTO toDtoCreateResponse(User user);

}
