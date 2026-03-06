package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Broker;
import br.com.systemit.strategyInvestment.strategy.repository.BrokerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BrokerValidator {

    private final BrokerRepository brokerRepository;

    public void validateNewBroker(Broker broker) {
        if (brokerNameExists(broker)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    private boolean brokerNameExists(Broker broker) {
        Optional<Broker> existing = brokerRepository.findByNameIgnoreCase(broker.getName());
        return existing.isPresent();
    }
}
