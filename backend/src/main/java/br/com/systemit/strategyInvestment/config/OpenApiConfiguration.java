package br.com.systemit.strategyInvestment.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

/**
 * http://localhost:8080/swagger-ui/index.html
 */
@Configuration
@OpenAPIDefinition(info = @Info(title = "Strategy Investment", version = "0.0.1", contact = @Contact(name = "Marcelo Bento", email = "celobento26@gmail.com", url = "systemit.com.br")))
public class OpenApiConfiguration {
}
