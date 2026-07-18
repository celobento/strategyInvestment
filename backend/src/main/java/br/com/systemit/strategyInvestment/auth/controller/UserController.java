package br.com.systemit.strategyInvestment.auth.controller;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.model.dto.SearchUserResponseDTO;
import br.com.systemit.strategyInvestment.auth.model.dto.UserCreateRequestDTO;
import br.com.systemit.strategyInvestment.auth.model.dto.mapper.UserMapper;
import br.com.systemit.strategyInvestment.auth.service.UserService;
import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
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
@RequestMapping("users")
@RequiredArgsConstructor
@Tag(name = "User")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    @Operation(summary = "Search users", description = "List all users or filter by username")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public ResponseEntity<List<SearchUserResponseDTO>> search(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email) {
        List<User> result = userService.search(username, email);
        List<SearchUserResponseDTO> response = result.stream()
                .map(userMapper::toDtoSearchUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get user by ID", description = "Find a single user by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not found"),
    })
    public ResponseEntity<String> read(@PathVariable("id") Integer id) {
        return userService.findById(id)
                .map(user -> {
                    SearchUserResponseDTO dto = userMapper.toDtoSearchUserResponse(user);
                    return ResponseEntity.ok(JsonUtil.objectToJson(dto));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(JsonUtil.objectToJson(new Problem(
                                ProcessingResultConstant.ERROR_NOT_FOUND.getId(),
                                ProcessingResultConstant.ERROR_NOT_FOUND.getDescription(),
                                List.of()))));
    }

    @PostMapping
    @Operation( summary = "Create user", description = "Endpoint to create a new user")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to create a new user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Saved successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> create(@RequestBody @Valid UserCreateRequestDTO dto){
        User user = userMapper.toEntity(dto);
        user = userService.save(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userMapper.toDtoCreateResponse(user));
    }

    @DeleteMapping("/{id}")
    @Operation( summary = "Delete user", description = "Endpoint to delete a user")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Data to delete a user")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted successfully"),
            @ApiResponse(responseCode = "500", description = "Uncataloged error"),
    })
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id){
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
