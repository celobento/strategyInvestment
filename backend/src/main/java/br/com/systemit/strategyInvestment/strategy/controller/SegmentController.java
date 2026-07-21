package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Segment;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchSegmentResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SegmentCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.SegmentMapper;
import br.com.systemit.strategyInvestment.strategy.service.SegmentService;
import br.com.systemit.strategyInvestment.util.JsonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    @Operation(summary = "Get segment by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return segmentService.findById(id)
                .map(segment -> ResponseEntity.ok(JsonUtil.objectToJson(segmentMapper.toDtoSearchResponse(segment))))
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    @Operation(summary = "Create segment")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created"),
    })
    public ResponseEntity<SearchSegmentResponseDTO> create(@RequestBody @Valid SegmentCreateRequestDTO dto) {
        Segment segment = new Segment();
        segment.setName(dto.name());
        segment.setDescription(dto.description() != null ? dto.description() : "");
        Segment saved = segmentService.save(segment);
        return ResponseEntity.status(HttpStatus.CREATED).body(segmentMapper.toDtoSearchResponse(saved));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update segment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<SearchSegmentResponseDTO> update(
            @PathVariable("id") Integer id,
            @RequestBody @Valid SegmentCreateRequestDTO dto) {
        return segmentService.findById(id).map(existing -> {
            existing.setName(dto.name());
            existing.setDescription(dto.description() != null ? dto.description() : "");
            return ResponseEntity.ok(segmentMapper.toDtoSearchResponse(segmentService.save(existing)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete segment")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted"),
    })
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        segmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
