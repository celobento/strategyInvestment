package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Segment;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchSegmentResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.SegmentMapper;
import br.com.systemit.strategyInvestment.strategy.service.SegmentService;
import br.com.systemit.strategyInvestment.util.JsonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("segments")
@RequiredArgsConstructor
@Tag(name = "Segment")
public class SegmentController {

    private final SegmentService segmentService;
    private final SegmentMapper segmentMapper;

    @GetMapping
    @Operation(summary = "Search segments", description = "List all segments or filter by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchSegmentResponseDTO>> search(
            @RequestParam(value = "name", required = false) String name) {
        List<Segment> result = segmentService.search(name);
        List<SearchSegmentResponseDTO> response = result.stream()
                .map(segmentMapper::toDtoSearchResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get segment by ID", description = "Find a single segment by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return segmentService.findById(id)
                .map(segment -> {
                    SearchSegmentResponseDTO dto = segmentMapper.toDtoSearchResponse(segment);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

}
