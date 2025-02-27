package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.model.dto.RevisionCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.RevisionMapper;
import br.com.systemit.strategyInvestment.strategy.service.RevisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("revisions")
@RequiredArgsConstructor
@Tag(name = "Revision")
public class RevisionController {

    private final RevisionService revisionService;
    private final RevisionMapper revisionMapper;

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
