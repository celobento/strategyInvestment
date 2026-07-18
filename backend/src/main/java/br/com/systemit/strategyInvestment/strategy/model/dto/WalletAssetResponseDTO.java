package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WalletAssetResponseDTO(
        Integer id,
        LocalDateTime addedAt,
        Integer walletId,
        Integer assetId,
        String assetName,
        String assetTicket,
        String categoryName,
        String sectorName,
        String segmentName,
        String countryAcronym,
        BigDecimal quantity,
        BigDecimal mediumPrice,
        BigDecimal currentPrice,
        String incomeType,
        String assetTypeName,
        String indicator,
        BigDecimal ceilingPrice
) {
}
