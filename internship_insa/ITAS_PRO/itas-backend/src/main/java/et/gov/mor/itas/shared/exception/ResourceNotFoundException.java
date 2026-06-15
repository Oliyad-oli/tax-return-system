package et.gov.mor.itas.shared.exception;

import java.util.UUID;

/**
 * Exception thrown when a requested resource is not found
 */
public class ResourceNotFoundException extends BusinessException {
    
    public ResourceNotFoundException(String resourceType, UUID id) {
        super("RESOURCE_NOT_FOUND", 
              String.format("%s with id %s not found", resourceType, id));
    }
    
    public ResourceNotFoundException(String resourceType, String identifier, String value) {
        super("RESOURCE_NOT_FOUND", 
              String.format("%s with %s %s not found", resourceType, identifier, value));
    }
}
