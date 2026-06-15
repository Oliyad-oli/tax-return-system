package et.gov.mor.itas.taxpayer.domain.model;

import java.util.UUID;

/**
 * Value Object for Taxpayer ID
 * Ensures type safety and domain clarity
 */
public record TaxpayerId(UUID value) {
    
    public TaxpayerId {
        if (value == null) {
            throw new IllegalArgumentException("Taxpayer ID cannot be null");
        }
    }
    
    public static TaxpayerId generate() {
        return new TaxpayerId(UUID.randomUUID());
    }
    
    public static TaxpayerId of(String uuid) {
        return new TaxpayerId(UUID.fromString(uuid));
    }
}
