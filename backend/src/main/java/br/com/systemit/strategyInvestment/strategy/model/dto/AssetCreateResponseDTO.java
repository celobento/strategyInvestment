package br.com.systemit.strategyInvestment.strategy.model.dto;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.Country;
import br.com.systemit.strategyInvestment.strategy.model.Sector;
import br.com.systemit.strategyInvestment.strategy.model.Segment;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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
