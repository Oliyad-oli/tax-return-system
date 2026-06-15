package et.gov.mor.itas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for ITAS Tax Administration System
 * 
 * Features:
 * - Domain-Driven Design (DDD)
 * - Hexagonal Architecture
 * - CQRS Pattern
 * - Event-Driven Architecture
 * - Real-time WebSocket notifications
 * - Kafka event streaming
 * - JWT Authentication with Keycloak
 * - Role-Based Access Control (RBAC)
 * - Audit trail with soft delete
 * - File storage with MinIO
 * - Full-text search with Elasticsearch
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableKafka
@EnableAsync
@EnableScheduling
public class ItasBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ItasBackendApplication.class, args);
    }
}
