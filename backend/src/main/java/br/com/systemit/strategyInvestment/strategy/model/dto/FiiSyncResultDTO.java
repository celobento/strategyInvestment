package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.util.List;

public record FiiSyncResultDTO(
        int updated,
        int failed,
        List<String> failedTickets
) {}
