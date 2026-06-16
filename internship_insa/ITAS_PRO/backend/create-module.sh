#!/bin/bash

# ITAS Backend Module Generator
# Creates the complete directory structure for a new business module

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
MODULE=$1
MODULE_PATH=$2

if [ -z "$MODULE" ] || [ -z "$MODULE_PATH" ]; then
    echo -e "${RED}Usage: ./create-module.sh ModuleName module-path${NC}"
    echo ""
    echo "Example:"
    echo "  ./create-module.sh Taxpayer taxpayer"
    echo "  ./create-module.sh ReturnFiling returnfiling"
    echo ""
    echo "This will create the complete package structure for the module."
    exit 1
fi

echo -e "${GREEN}Creating module: $MODULE (path: $MODULE_PATH)${NC}"
echo ""

BASE_PKG="src/main/java/com/act/itas"

# Domain structure
echo -e "${YELLOW}Creating domain structure...${NC}"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/aggregate"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/entity"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/valueobject"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/service"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/event"
echo "  ✓ domain/$MODULE_PATH/*"

# Application structure
echo -e "${YELLOW}Creating application structure...${NC}"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/command"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/query"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/handler"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/service"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/port"
echo "  ✓ application/$MODULE_PATH/*"

# Persistence structure
echo -e "${YELLOW}Creating persistence structure...${NC}"
mkdir -p "$BASE_PKG/persistence/$MODULE_PATH/entity"
mkdir -p "$BASE_PKG/persistence/$MODULE_PATH/repository"
mkdir -p "$BASE_PKG/persistence/$MODULE_PATH/adapter"
echo "  ✓ persistence/$MODULE_PATH/*"

# API structure
echo -e "${YELLOW}Creating API structure...${NC}"
mkdir -p "$BASE_PKG/api/controller/$MODULE_PATH"
mkdir -p "$BASE_PKG/api/dto/request/$MODULE_PATH"
mkdir -p "$BASE_PKG/api/dto/response/$MODULE_PATH"
echo "  ✓ api/{controller,dto}/$MODULE_PATH/*"

# Test structure
echo -e "${YELLOW}Creating test structure...${NC}"
TEST_BASE="src/test/java/com/act/itas"
mkdir -p "$TEST_BASE/domain/$MODULE_PATH"
mkdir -p "$TEST_BASE/application/$MODULE_PATH"
mkdir -p "$TEST_BASE/persistence/$MODULE_PATH"
mkdir -p "$TEST_BASE/api/controller/$MODULE_PATH"
echo "  ✓ test/*/$MODULE_PATH/*"

# Migration placeholder
echo -e "${YELLOW}Creating migration placeholder...${NC}"
MIGRATION_DIR="src/main/resources/db/migration"
mkdir -p "$MIGRATION_DIR"
MIGRATION_FILE="$MIGRATION_DIR/V_TODO__${MODULE_PATH}_module.sql"
cat > "$MIGRATION_FILE" << EOF
-- TODO: Rename this file with the correct version number
-- Example: V2__${MODULE_PATH}_module.sql

-- ${MODULE} Module Tables

CREATE TABLE IF NOT EXISTS ${MODULE_PATH}_table (
    id UUID PRIMARY KEY,
    -- Add your columns here
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_${MODULE_PATH}_status ON ${MODULE_PATH}_table(status);
CREATE INDEX idx_${MODULE_PATH}_created_at ON ${MODULE_PATH}_table(created_at);

COMMENT ON TABLE ${MODULE_PATH}_table IS 'Stores ${MODULE} aggregates';
EOF
echo "  ✓ db/migration/${MODULE_PATH}_module.sql (TODO: rename with version)"

# Create README for the module
MODULE_README="$BASE_PKG/domain/$MODULE_PATH/README.md"
cat > "$MODULE_README" << EOF
# ${MODULE} Module

## Domain Layer

- **Aggregate**: ${MODULE}
- **Value Objects**: ${MODULE}Status, ${MODULE}Type, etc.
- **Events**: ${MODULE}CreatedEvent, ${MODULE}UpdatedEvent, etc.

## Application Layer

- **Commands**: Create${MODULE}Command, Update${MODULE}Command, etc.
- **Queries**: Find${MODULE}ByIdQuery, List${MODULE}Query, etc.
- **Handlers**: Create${MODULE}Handler, Update${MODULE}Handler, etc.
- **Ports**: ${MODULE}RepositoryPort, etc.

## Persistence Layer

- **Entity**: ${MODULE}JpaEntity
- **Repository**: ${MODULE}JpaRepository
- **Adapter**: ${MODULE}PersistenceAdapter

## API Layer

- **Controller**: ${MODULE}Controller
- **DTOs**: Create${MODULE}Request, ${MODULE}Response, etc.

## Next Steps

1. Implement the aggregate root in \`aggregate/${MODULE}.java\`
2. Define value objects in \`valueobject/\`
3. Create domain events in \`event/\`
4. Implement commands and queries
5. Write handlers
6. Create persistence layer
7. Implement REST controller
8. Write tests

See \`MODULE_GENERATOR_GUIDE.md\` for detailed implementation instructions.
EOF
echo "  ✓ domain/$MODULE_PATH/README.md"

echo ""
echo -e "${GREEN}✅ Module structure created successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Follow MODULE_GENERATOR_GUIDE.md to implement the module"
echo "2. Start with the domain aggregate: $BASE_PKG/domain/$MODULE_PATH/aggregate/${MODULE}.java"
echo "3. Define value objects in: $BASE_PKG/domain/$MODULE_PATH/valueobject/"
echo "4. Create domain events in: $BASE_PKG/domain/$MODULE_PATH/event/"
echo "5. Implement the database migration: $MIGRATION_FILE"
echo ""
echo -e "${GREEN}Good luck! 🚀${NC}"
