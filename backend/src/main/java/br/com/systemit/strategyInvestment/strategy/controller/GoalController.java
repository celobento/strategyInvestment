package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.strategy.model.Goal;
import br.com.systemit.strategyInvestment.strategy.model.dto.GoalRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.GoalResponseDTO;
import br.com.systemit.strategyInvestment.strategy.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("goals")
@RequiredArgsConstructor
@Tag(name = "Goals")
public class GoalController {

    private final GoalService service;

    @GetMapping
    @Operation(summary = "List goals")
    public ResponseEntity<List<GoalResponseDTO>> list() {
        return ResponseEntity.ok(service.findAll().stream().map(GoalController::toDto).toList());
    }

    @PostMapping
    @Operation(summary = "Create goal")
    public ResponseEntity<GoalResponseDTO> create(@RequestBody @Valid GoalRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(service.create(fromDto(dto))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update goal")
    public ResponseEntity<GoalResponseDTO> update(@PathVariable Integer id, @RequestBody @Valid GoalRequestDTO dto) {
        return service.findById(id).map(existing -> {
            existing.setDescription(dto.description());
            existing.setGoalValue(dto.goalValue());
            existing.setLimitDate(dto.limitDate());
            existing.setStartDate(dto.startDate());
            existing.setMonthlyRate(dto.monthlyRate());
            existing.setInitialBalance(dto.initialBalance());
            return ResponseEntity.ok(toDto(service.update(existing)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete goal")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static Goal fromDto(GoalRequestDTO dto) {
        Goal g = new Goal();
        g.setDescription(dto.description());
        g.setGoalValue(dto.goalValue());
        g.setLimitDate(dto.limitDate());
        g.setStartDate(dto.startDate());
        g.setMonthlyRate(dto.monthlyRate());
        g.setInitialBalance(dto.initialBalance());
        return g;
    }

    private static GoalResponseDTO toDto(Goal g) {
        return new GoalResponseDTO(
                g.getId(),
                g.getDescription(),
                g.getGoalValue(),
                g.getLimitDate(),
                g.getStartDate(),
                g.getMonthlyRate(),
                g.getInitialBalance(),
                g.getCreatedAt()
        );
    }
}
