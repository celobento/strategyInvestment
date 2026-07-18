---
name: verify
description: Start the app and confirm a feature works end-to-end via Swagger before marking a task done. Use after implementing a change to validate it in the running app.
disable-model-invocation: false
---

1. Check if the app is already running on port 8080: `lsof -i :8080 | grep LISTEN`
2. If not running, start it with `./mvnw spring-boot:run` in the background and wait for "Started Application" in the log.
3. Open Swagger UI at http://localhost:8080/swagger-ui/index.html to identify the relevant endpoint(s).
4. Exercise the endpoint(s) affected by the change — include both the happy path and at least one error case (missing field, unauthorized, not found).
5. For auth-protected endpoints, first POST to `/auth` with valid credentials to obtain a session, then include it in subsequent requests.
6. Report: which endpoints were tested, what responses were observed, and whether the feature behaves as expected. Flag any unexpected errors or status codes.
