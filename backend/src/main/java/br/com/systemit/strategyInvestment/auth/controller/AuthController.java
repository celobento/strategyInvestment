package br.com.systemit.strategyInvestment.auth.controller;

import br.com.systemit.strategyInvestment.auth.model.User;
import br.com.systemit.strategyInvestment.auth.model.dto.LoginRequestDTO;
import br.com.systemit.strategyInvestment.auth.model.dto.LoginResponseDTO;
import br.com.systemit.strategyInvestment.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder encoder;

    @PostMapping
    @Operation(summary = "Login", description = "Endpoint to authenticate a user")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "User credentials")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authenticated successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
    })
    public ResponseEntity<Object> login(@RequestBody LoginRequestDTO dto) {
        User user = userService.getByUsername(dto.username());

        if (user == null || !encoder.matches(dto.password(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        LoginResponseDTO response = new LoginResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles()
        );

        return ResponseEntity.ok(response);
    }
}
