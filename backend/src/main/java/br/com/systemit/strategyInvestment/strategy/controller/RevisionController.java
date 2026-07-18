package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.model.dto.RevisionCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchRevisionResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.RevisionMapper;
import br.com.systemit.strategyInvestment.strategy.service.RevisionService;
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
@RequestMapping("revisions")
@RequiredArgsConstructor
@Tag(name = "Revision")
public class RevisionController {

    private final RevisionService revisionService;
    private final RevisionMapper revisionMapper;

    @GetMapping
    @Operation(summary = "List revisions", description = "List all revisions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchRevisionResponseDTO>> search() {
        List<Revision> result = revisionService.findAll();
        List<SearchRevisionResponseDTO> response = result.stream()
                .map(revisionMapper::toDtoSearchRevisionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get revision by ID", description = "Find a single revision by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return revisionService.findById(id)
                .map(revision -> {
                    SearchRevisionResponseDTO dto = revisionMapper.toDtoSearchRevisionResponse(revision);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    @Operation( summary = "Create revision", description = "Endpoint to create a new revision")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to create new revision")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid RevisionCreateRequestDTO dto) {
        Revision revision = revisionMapper.toEntity(dto);
        revision = revisionService.save(revision);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(revisionMapper.toDtoCreateResponse(revision));
    }

    @DeleteMapping("/{id}")
    @Operation( summary = "Delete revision", description = "Endpoint to delete a revision")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a revision")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id){
        revisionService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
