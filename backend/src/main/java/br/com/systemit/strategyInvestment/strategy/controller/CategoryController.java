package br.com.systemit.strategyInvestment.strategy.controller;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryCreateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.CategoryUpdateRequestDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.SearchCategoryResponseDTO;
import br.com.systemit.strategyInvestment.strategy.model.dto.mapper.CategoryMapper;
import br.com.systemit.strategyInvestment.strategy.service.CategoryService;
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
@RequestMapping("categories")
@RequiredArgsConstructor
@Tag(name = "Category")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @PostMapping
    @Operation( summary = "Create category", description = "Endpoint to create a new category")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to create new category")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid CategoryCreateRequestDTO dto) {
        Category category = categoryMapper.toEntity(dto);
        category = categoryService.salvar(category);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(categoryMapper.toDtoCreateResponse(category));
    }

    @GetMapping
    public ResponseEntity<List<SearchCategoryResponseDTO>> search(
          @RequestParam(value = "name", required = false) String name
    ){
        List<Category> searchResult = categoryService.pesquisar(name);
        List<SearchCategoryResponseDTO> response = searchResult.stream().map(categoryMapper::toDtoSearchCategoryResponse).collect(Collectors.toList());
        return ResponseEntity.ok().body(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE )
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return categoryService.findById(id)
                .map(category -> {
                    SearchCategoryResponseDTO dto = categoryMapper.toDtoSearchCategoryResponse(category);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));

                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));

    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(
            @PathVariable("id") Integer id,
            @RequestBody @Valid CategoryUpdateRequestDTO dto){

        Category category = categoryMapper.toEntity(dto);
        category.setId(id);
        category = categoryService.update(category);
        return ResponseEntity.status(HttpStatus.OK).body(category);
    }

    @DeleteMapping("/{id}")
    @Operation( summary = "Delete category", description = "Endpoint to delete a category")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a category")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id){
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
