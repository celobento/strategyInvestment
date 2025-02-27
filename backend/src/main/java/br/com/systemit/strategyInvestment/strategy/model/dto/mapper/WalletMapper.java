package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.auth.model.dto.mapper.UserMapper;
import br.com.systemit.strategyInvestment.auth.repository.UserRepository;
import br.com.systemit.strategyInvestment.strategy.model.Wallet;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.WalletCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.repository.AssetRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public abstract class WalletMapper {

    @Autowired
    UserRepository userRepository;

    @Mapping(target = "user", expression = "java( userRepository.findById(dto.user()).orElse(null)) ")
    public abstract Wallet toEntity(WalletCreateRequestDTO dto);

    //Wallet toEntity(WalletUpdateRequestDTO dto);

    //public abstract WalletCreateRequestDTO toDto(Wallet wallet);

    public abstract WalletCreateResponseDTO toDtoCreateResponse(Wallet wallet);

    //SearchWalletResponseDTO toDtoSearchWalletResponse(Wallet wallet);

}
