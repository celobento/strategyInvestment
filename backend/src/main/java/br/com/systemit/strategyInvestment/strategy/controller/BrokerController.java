package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.service.BrokerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("brokers")
@RequiredArgsConstructor
@Tag(name = "Broker")
public class BrokerController {

    private BrokerService brokerService;
}
