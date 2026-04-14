# ── Stage 1: Build ───────────────────────────────────────────
FROM maven:3.8.6-openjdk-17-slim AS build
WORKDIR /app

# Cache das dependências em camada separada (rebuild mais rápido)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build do projeto
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/tasky.jar app.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
