FROM maven:3.9-eclipse-temurin-17
WORKDIR /app

# Cache das dependências em camada separada (rebuild mais rápido)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build do projeto
COPY src ./src
RUN mvn clean package -DskipTests -B

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "target/tasky.jar"]
