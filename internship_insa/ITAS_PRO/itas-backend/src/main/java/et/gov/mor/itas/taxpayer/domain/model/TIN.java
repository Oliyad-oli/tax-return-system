package et.gov.mor.itas.taxpayer.domain.model;

/**
 * Value Object for Tax Identification Number (TIN)
 * Enforces format validation and business rules
 */
public record TIN(String value) {
    
    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 20;
    
    public TIN {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("TIN cannot be empty");
        }
        
        String cleaned = value.trim();
        if (cleaned.length() < MIN_LENGTH || cleaned.length() > MAX_LENGTH) {
            throw new IllegalArgumentException(
                String.format("TIN must be between %d and %d characters", MIN_LENGTH, MAX_LENGTH)
            );
        }
        
        // TODO: Add Ethiopian TIN format validation if needed
        value = cleaned;
    }
    
    public static TIN of(String value) {
        return new TIN(value);
    }
}
