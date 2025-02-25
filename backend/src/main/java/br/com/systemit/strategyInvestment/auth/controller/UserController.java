package br.com.systemit.strategyInvestment.auth.controller;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.model.dto.UserCreateRequestDTO;
import br.com.systemit.strategyInvestment.auth.model.dto.mapper.UserMapper;
import br.com.systemit.strategyInvestment.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("users")
@RequiredArgsConstructor
@Tag(name = "User")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

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
}
