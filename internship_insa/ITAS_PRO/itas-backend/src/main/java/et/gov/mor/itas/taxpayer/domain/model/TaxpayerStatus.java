package et.gov.mor.itas.taxpayer.domain.model;

/**
 * Taxpayer status lifecycle
 */
public enum TaxpayerStatus {
    ACTIVE,
    SUSPENDED,
    DEREGISTERED;
    
    public boolean canTransitionTo(TaxpayerStatus newStatus) {
        return switch (this) {
            case ACTIVE -> newStatus == SUSPENDED || newStatus == DEREGISTERED;
            case SUSPENDED -> newStatus == ACTIVE || newStatus == DEREGISTERED;
            case DEREGISTERED -> false; // Final state
        };
    }
}
