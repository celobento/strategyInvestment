package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.DividendEntry;
import br.com.systemit.strategyInvestment.strategy.model.dto.DividendEntryRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.DividendEntryResponseDTO;
import br.com.systemit.strategyInvestment.strategy.service.DividendEntryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("dividend-entries")
@RequiredArgsConstructor
@Tag(name = "Dividend Entries")
public class DividendEntryController {

    private final DividendEntryService service;

    @GetMapping
    @Operation(summary = "List dividend entries")
    public ResponseEntity<List<DividendEntryResponseDTO>> list(
            @RequestParam(required = false) Integer year) {
        List<DividendEntry> items = year != null ? service.findByYear(year) : service.findAll();
        return ResponseEntity.ok(items.stream().map(DividendEntryController::toDto).toList());
    }

    @PostMapping
    @Operation(summary = "Create dividend entry")
    public ResponseEntity<DividendEntryResponseDTO> create(
            @RequestBody @Valid DividendEntryRequestDTO dto) {
        DividendEntry entry = fromDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(service.create(entry)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update dividend entry")
    public ResponseEntity<DividendEntryResponseDTO> update(
            @PathVariable Integer id,
            @RequestBody @Valid DividendEntryRequestDTO dto) {
        return service.findById(id).map(existing -> {
            existing.setCategory(dto.category());
            existing.setMonth(dto.month());
            existing.setYear(dto.year());
            existing.setValue(dto.value());
            existing.setCurrency(dto.currency() != null ? dto.currency() : "BRL");
            return ResponseEntity.ok(toDto(service.update(existing)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete dividend entry")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static DividendEntry fromDto(DividendEntryRequestDTO dto) {
        DividendEntry e = new DividendEntry();
        e.setCategory(dto.category());
        e.setMonth(dto.month());
        e.setYear(dto.year());
        e.setValue(dto.value());
        e.setCurrency(dto.currency() != null ? dto.currency() : "BRL");
        return e;
    }

    static DividendEntryResponseDTO toDto(DividendEntry e) {
        return new DividendEntryResponseDTO(
                e.getId(), e.getCategory(), e.getMonth(), e.getYear(),
                e.getValue(), e.getCurrency(), e.getCreatedAt());
    }
}
