package br.com.systemit.strategyInvestment.strategy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Broker;
import br.com.systemit.strategyInvestment.strategy.model.dto.BrokerCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.BrokerCreateResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchBrokerResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.BrokerMapper;
import br.com.systemit.strategyInvestment.strategy.service.BrokerService;
import br.com.systemit.strategyInvestment.util.JsonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("brokers")
@RequiredArgsConstructor
@Tag(name = "Broker")
public class BrokerController {

    private final BrokerService brokerService;
    private final BrokerMapper brokerMapper;

    @GetMapping
    @Operation(summary = "Search brokers", description = "List all brokers or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchBrokerResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<Broker> result = brokerService.search(name);
        List<SearchBrokerResponseDTO> response = result.stream()
                .map(brokerMapper::toDtoSearchBrokerResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get broker by ID", description = "Find a single broker by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return brokerService.findById(id)
                .map(broker -> {
                    SearchBrokerResponseDTO dto = brokerMapper.toDtoSearchBrokerResponse(broker);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    public ResponseEntity<BrokerCreateResponseDTO> save(@RequestBody @Valid BrokerCreateRequestDTO dto) {
        Broker broker = brokerMapper.toEntity(dto);
        broker = brokerService.save(broker);
        return ResponseEntity.status(HttpStatus.CREATED).body(brokerMapper.toDtoCreateResponse(broker));
    }
}
