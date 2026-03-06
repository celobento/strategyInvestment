package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import br.com.systemit.strategyInvestment.strategy.model.Broker;
import br.com.systemit.strategyInvestment.strategy.model.dto.BrokerCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.BrokerCreateResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrokerMapper {

    @org.mapstruct.Mapping(target = "id", ignore = true)
    Broker toEntity(BrokerCreateRequestDTO dto);

    BrokerCreateResponseDTO toDtoCreateResponse(Broker broker);

}
