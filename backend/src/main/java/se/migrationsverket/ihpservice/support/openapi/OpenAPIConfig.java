package se.migrationsverket.ihpservice.support.openapi;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.HeaderParameter;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

import java.util.List;
import java.util.stream.Stream;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.*;

@Configuration
public class OpenAPIConfig {

    private static final String title = "IHPv rest-api";
    private static final String description = "API för IHP-Verktyget";
    private static final String version = "1";
    private static final String name = "Teamet";
    private static final String email = "team@acme.com";
    private static final String urlo = "https://google.com";
    private static final String correlationIdDesc = "Id som skickas mellan requests";
    private static final String consumerDesc = "Konsument av tjänsten";
    private static final String authDesc = "Användare id";
    private static final String header = "header";
    @Value("${openapi.server:}")
    private String server;

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info().title(title)
                        .description(description)
                        .version(version)
                        .contact(new Contact()
                                .email(email)
                                .url(urlo)
                                .name(name)));

        if (!server.isEmpty()) {
            openAPI.setServers(List.of(new io.swagger.v3.oas.models.servers.Server().url(server)));
        }
        return openAPI;
    }

    @Bean
    public OperationCustomizer customGlobalHeaders() {
        return (Operation operation, HandlerMethod handlerMethod) -> {

            boolean hasCorrelationId = operation.getParameters() != null &&
                    operation.getParameters().stream()
                            .anyMatch(p -> CORRELATION_ID.equals(p.getName()) && "header".equals(p.getIn()));


            if (!hasCorrelationId) {
                Parameter correlationIdParam = new Parameter()
                        .in(header)
                        .name(CORRELATION_ID)
                        .description(correlationIdDesc)
                        .required(true)
                        .schema(new StringSchema());
                operation.addParametersItem(correlationIdParam);
            }

            Parameter consumerParam = new Parameter()
                    .in(header)
                    .name(CONSUMER)
                    .description(consumerDesc)
                    .required(true)
                    .schema(new StringSchema());

            Parameter authParam = new Parameter()
                    .in(header)
                    .name(AUTH)
                    .description(authDesc)
                    .required(true)
                    .schema(new StringSchema());

            operation.addParametersItem(consumerParam);
            operation.addParametersItem(authParam);
            return operation;
        };
    }

    @Bean
    public OpenApiCustomiser consumerTypeHeaderOpenAPICustomizer() {
        return openApi -> openApi.getPaths().values().stream().flatMap(pathItem -> pathItem.readOperations().stream())
                .forEach(operation -> Stream.of(CORRELATION_ID, CONSUMER)
                        .filter(s -> operation.getParameters() == null ||
                                operation.getParameters().stream().map(Parameter::getName).noneMatch(ps -> ps.contains(s)))
                        .forEach(n ->
                                operation.addParametersItem(
                                        new HeaderParameter().name(n).$ref("#/components/parameters/" + n))));
    }

}

