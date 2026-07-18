package br.com.systemit.strategyInvestment.strategy.model.dto.mapper;

import org.mapstruct.Mapper;

import br.com.systemit.strategyInvestment.strategy.model.Segment;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchSegmentResponseDTO;

@Mapper(componentModel = "spring")
public interface SegmentMapper {

    SearchSegmentResponseDTO toDtoSearchResponse(Segment segment);

}
