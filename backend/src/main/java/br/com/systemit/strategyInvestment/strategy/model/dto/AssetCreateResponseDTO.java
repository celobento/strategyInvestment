package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.Segment;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AssetCreateResponse")
public record AssetCreateResponseDTO(

                Integer id,
                String name,
                String ticket,
                String description,
                Country country,
                Category category,
                Sector sector,
                Segment segment) {
}
