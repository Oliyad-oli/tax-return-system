#!/bin/bash

echo "🚀 Starting ITAS Backend Development Environment"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Starting infrastructure services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ Infrastructure is ready!"
echo ""
echo "Services:"
echo "  - PostgreSQL:     localhost:5432"
echo "  - Redis:          localhost:6379"
echo "  - Kafka:          localhost:9092"
echo "  - MinIO:          localhost:9000 (console: localhost:9001)"
echo "  - Elasticsearch:  localhost:9200"
echo "  - Keycloak:       localhost:8180"
echo ""
echo "MinIO Console: http://localhost:9001"
echo "  Username: minioadmin"
echo "  Password: minioadmin"
echo ""
echo "Keycloak Admin: http://localhost:8180"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "🔨 Building application..."
mvn clean package -DskipTests

echo ""
echo "🚀 Starting Spring Boot application..."
echo ""
mvn spring-boot:run
