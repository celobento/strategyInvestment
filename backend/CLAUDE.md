# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Spring Boot 3.4.2 / Java 21 investment strategy management API backed by PostgreSQL.

## Build & Run

```bash
./mvnw spring-boot:run    # start the app (port 8080)
./mvnw test               # run tests
./mvnw clean install      # full build
./mvnw compile -q         # fast compile check
```

## Dev Setup

1. Create `.env` at the project root:
   ```
   DATASOURCE_URL=jdbc:postgresql://localhost:5432/<db>
   DATASOURCE_USERNAME=<user>
   DATASOURCE_PASSWORD=<password>
   ```
2. Run `data-base-scripts.sql` against PostgreSQL to create schemas `strategy` and `auth`.
3. `./mvnw spring-boot:run`

## Architecture

Layers (always follow this order): **Controller → Validator → Service → Repository**

- `br.com.systemit.strategyInvestment.auth` — authentication (User, Spring Security)
- `br.com.systemit.strategyInvestment.strategy` — investment domain (Asset, Wallet, Broker, Sector, etc.)
- `br.com.systemit.strategyInvestment.handle` — global `@RestControllerAdvice`
- `br.com.systemit.strategyInvestment.config` — OpenAPI/Swagger

Each entity has: entity → request/response DTOs → MapStruct mapper → `@Component` validator → service → repository. The validator runs inside the service before save/update — not via `@Valid` alone.

## Naming Convention

New code must use **English** method names. The codebase is migrating away from Portuguese names (`buscaPorNome`, `salvar`, etc.) — do not add new Portuguese identifiers.

## Exception Handling

- `StrategyInvestmentException` → 400 BAD_REQUEST (domain/validation failures)
- `MethodArgumentNotValidException` → 400 BAD_REQUEST
- `AuthorizationDeniedException` → 403 FORBIDDEN
- `RuntimeException` → 500 INTERNAL_SERVER_ERROR

## Key Notes

- **No migration tool**: Schema is managed manually via `data-base-scripts.sql`. After adding an entity, update this script.
- **Roles as PostgreSQL array**: Uses Hypersistence Utils `ListArrayType` — do not change this mapping.
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **Actuator**: http://localhost:9090/actuator (logfile, health, metrics on a separate port)
- **MapStruct + Lombok**: Both annotation processors active. New mappers go in `model/dto/mapper/`.
