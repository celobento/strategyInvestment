package br.com.systemit.strategyInvestment.strategy.model.dto;

import java.util.List;

public record FiiSyncStatusDTO(
        boolean running,
        int processed,
        int total,
        int updated,
        int failed,
        List<String> failedTickets
) {}
