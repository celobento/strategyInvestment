package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Broker;
import br.com.systemit.strategyInvestment.strategy.repository.BrokerRepository;
import br.com.systemit.strategyInvestment.strategy.validator.BrokerValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BrokerService {

    private final BrokerRepository brokerRepository;
    private final BrokerValidator validator;

    public Optional<Broker> findById(Integer id) {
        return brokerRepository.findById(id);
    }

    public List<Broker> search(String name) {
        if (name != null && !name.isEmpty()) {
            return brokerRepository.findByNameContainingIgnoreCase(name);
        }
        return brokerRepository.findAll();
    }

    public Broker save(Broker broker) {
        validator.validateNewBroker(broker);
        return brokerRepository.save(broker);
    }
}
