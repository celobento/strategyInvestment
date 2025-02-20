package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.model.dto.RevisionCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.RevisionMapper;
import br.com.systemit.strategyInvestment.strategy.service.RevisionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("revisions")
@RequiredArgsConstructor
@Tag(name = "Revision")
public class RevisionController {

    private final RevisionService revisionService;
    private final RevisionMapper revisionMapper;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody @Valid RevisionCreateRequestDTO dto) {
        Revision revision = revisionMapper.toEntity(dto);
        revision = revisionService.save(revision);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(revisionMapper.toDtoCreateResponse(revision));
    }


}
