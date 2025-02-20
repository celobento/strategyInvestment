package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.repository.BrokerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BrokerService {

    private final BrokerRepository brokerRepository;
}
