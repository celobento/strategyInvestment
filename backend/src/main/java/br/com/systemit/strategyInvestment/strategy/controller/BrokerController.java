package br.com.systemit.strategyInvestment.strategy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.systemit.strategyInvestment.strategy.model.Broker;
import br.com.systemit.strategyInvestment.strategy.model.dto.BrokerCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.BrokerCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.BrokerMapper;
import br.com.systemit.strategyInvestment.strategy.service.BrokerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("brokers")
@RequiredArgsConstructor
@Tag(name = "Broker")
public class BrokerController {

    private final BrokerService brokerService;
    private final BrokerMapper brokerMapper;

    @PostMapping
    public ResponseEntity<BrokerCreateResponseDTO> save(@RequestBody @Valid BrokerCreateRequestDTO dto) {
        Broker broker = brokerMapper.toEntity(dto);
        broker = brokerService.save(broker);
        return ResponseEntity.status(HttpStatus.CREATED).body(brokerMapper.toDtoCreateResponse(broker));
    }
}
