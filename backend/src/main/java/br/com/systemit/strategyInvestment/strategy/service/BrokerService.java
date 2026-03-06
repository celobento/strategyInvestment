package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Broker;
import br.com.systemit.strategyInvestment.strategy.repository.BrokerRepository;
import br.com.systemit.strategyInvestment.strategy.validator.BrokerValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BrokerService {

    private final BrokerRepository brokerRepository;
    private final BrokerValidator validator;

    public Broker save(Broker broker) {
        validator.validateNewBroker(broker);
        return brokerRepository.save(broker);
    }
}
