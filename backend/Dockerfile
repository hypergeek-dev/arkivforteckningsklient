# --- Steg 1: Byggfas (Builder Stage) ---
# Använd en officiell Maven-image med JDK 17 för att bygga projektet.
FROM maven:3.9.11-eclipse-temurin-17 AS builder

# Sätt arbetsmappen i containern.
WORKDIR /app

# Kopiera projektets `pom.xml` och ladda ner beroenden.
COPY pom.xml .
RUN mvn dependency:go-offline

# Kopiera resten av källkoden.
COPY src ./src

# Bygg applikationen och hoppa över tester.
RUN mvn package -DskipTests



# --- Steg 2: Körfas (Runtime Stage) ---
# Använd en lättvikts-image med enbart JRE 17 för att köra appen.
# 'eclipse-temurin' är ett populärt och pålitligt alternativ till OpenJDK-images.
FROM gcr.io/distroless/java17-debian11:latest

# Sätt arbetsmappen i containern för körfasen.
WORKDIR /app

# Kopiera den färdigbyggda JAR-filen från byggfasen till den nya imagen.
COPY --from=builder /app/target/*-exec.jar /app/app.jar


# Exponera porten som Spring Boot-appen lyssnar på (standard är 8080).
EXPOSE 8080

#CMD ["/bin/sh", "-c", "while :; do sleep 1; done"]

# Definiera kommandot som startar applikationen när containern körs.
#CMD ["java", "-jar", "app.jar"]
CMD ["/app/app.jar"]

