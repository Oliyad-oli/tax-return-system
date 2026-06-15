package et.gov.mor.itas.taxpayer.domain.model;

import et.gov.mor.itas.shared.domain.BaseDomainEvent;
import et.gov.mor.itas.shared.exception.BusinessException;
import et.gov.mor.itas.taxpayer.domain.event.TaxpayerCreatedEvent;
import et.gov.mor.itas.taxpayer.domain.event.TaxpayerStatusChangedEvent;
import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Taxpayer Aggregate Root
 * Pure domain logic - no framework dependencies
 */
@Getter
public class Taxpayer {
    
    private final TaxpayerId id;
    private final TIN tin;
    private String name;
    private String tradeName;
    private TaxpayerKind kind;
    private TaxpayerSegment segment;
    private TaxpayerStatus status;
    private String region;
    private String branch;
    private String phone;
    private String email;
    private final Instant registeredAt;
    private int complianceScore;
    private boolean vatRegistered;
    
    // Domain events (not persisted)
    private final List<BaseDomainEvent> domainEvents = new ArrayList<>();
    
    // Private constructor - use factory methods
    private Taxpayer(
        TaxpayerId id,
        TIN tin,
        String name,
        String tradeName,
        TaxpayerKind kind,
        TaxpayerSegment segment,
        String region,
        String branch,
        String phone,
        String email,
        boolean vatRegistered
    ) {
        this.id = id;
        this.tin = tin;
        this.name = name;
        this.tradeName = tradeName;
        this.kind = kind;
        this.segment = segment;
        this.status = TaxpayerStatus.ACTIVE;
        this.region = region;
        this.branch = branch;
        this.phone = phone;
        this.email = email;
        this.registeredAt = Instant.now();
        this.complianceScore = 50; // Default middle score
        this.vatRegistered = vatRegistered;
    }


    /**
     * Factory method to create a new Taxpayer
     */
    public static Taxpayer create(
        TIN tin,
        String name,
        String tradeName,
        TaxpayerKind kind,
        TaxpayerSegment segment,
        String region,
        String branch,
        String phone,
        String email,
        boolean vatRegistered
    ) {
        TaxpayerId id = TaxpayerId.generate();
        Taxpayer taxpayer = new Taxpayer(
            id, tin, name, tradeName, kind, segment,
            region, branch, phone, email, vatRegistered
        );
        
        taxpayer.registerEvent(new TaxpayerCreatedEvent(
            id.value(), tin.value(), name, kind, segment
        ));
        
        return taxpayer;
    }
    
    /**
     * Change taxpayer status with validation
     */
    public void changeStatus(TaxpayerStatus newStatus, String reason) {
        if (!this.status.canTransitionTo(newStatus)) {
            throw new BusinessException(
                "INVALID_STATUS_TRANSITION",
                String.format("Cannot transition from %s to %s", this.status, newStatus)
            );
        }
        
        TaxpayerStatus oldStatus = this.status;
        this.status = newStatus;
        
        registerEvent(new TaxpayerStatusChangedEvent(
            id.value(), tin.value(), oldStatus, newStatus, reason
        ));
    }
    
    /**
     * Update taxpayer information
     */
    public void updateInfo(
        String name,
        String tradeName,
        String phone,
        String email
    ) {
        if (this.status == TaxpayerStatus.DEREGISTERED) {
            throw new BusinessException(
                "TAXPAYER_DEREGISTERED",
                "Cannot update deregistered taxpayer"
            );
        }
        
        this.name = name;
        this.tradeName = tradeName;
        this.phone = phone;
        this.email = email;
    }
    
    /**
     * Update compliance score (0-100)
     */
    public void updateComplianceScore(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Compliance score must be between 0 and 100");
        }
        this.complianceScore = score;
    }
    
    private void registerEvent(BaseDomainEvent event) {
        this.domainEvents.add(event);
    }
    
    public List<BaseDomainEvent> getDomainEvents() {
        return List.copyOf(domainEvents);
    }
    
    public void clearDomainEvents() {
        domainEvents.clear();
    }
}
