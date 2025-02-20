package br.com.systemit.strategyInvestment.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Strategy Investment",
                version = "0.0.1",
                contact = @Contact(
                        name = "Marcelo Bento",
                        email = "celobento26@gmail.com",
                        url = "systemit.com.br"
                )
        )
)
public class OpenApiConfiguration {
}
