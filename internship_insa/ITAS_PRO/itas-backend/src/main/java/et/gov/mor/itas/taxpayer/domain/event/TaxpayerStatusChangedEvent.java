package et.gov.mor.itas.taxpayer.domain.event;

import et.gov.mor.itas.shared.domain.BaseDomainEvent;
import et.gov.mor.itas.taxpayer.domain.model.TaxpayerStatus;
import lombok.Getter;

import java.util.UUID;

/**
 * Domain event published when taxpayer status changes
 */
@Getter
public class TaxpayerStatusChangedEvent extends BaseDomainEvent {
    
    private final String tin;
    private final TaxpayerStatus oldStatus;
    private final TaxpayerStatus newStatus;
    private final String reason;
    
    public TaxpayerStatusChangedEvent(
        UUID taxpayerId,
        String tin,
        TaxpayerStatus oldStatus,
        TaxpayerStatus newStatus,
        String reason
    ) {
        super(taxpayerId);
        this.tin = tin;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.reason = reason;
    }
}
