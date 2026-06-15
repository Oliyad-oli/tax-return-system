package et.gov.mor.itas.taxpayer.domain.event;

import et.gov.mor.itas.shared.domain.BaseDomainEvent;
import et.gov.mor.itas.taxpayer.domain.model.TaxpayerKind;
import et.gov.mor.itas.taxpayer.domain.model.TaxpayerSegment;
import lombok.Getter;

import java.util.UUID;

/**
 * Domain event published when a taxpayer is created
 */
@Getter
public class TaxpayerCreatedEvent extends BaseDomainEvent {
    
    private final String tin;
    private final String name;
    private final TaxpayerKind kind;
    private final TaxpayerSegment segment;
    
    public TaxpayerCreatedEvent(
        UUID taxpayerId,
        String tin,
        String name,
        TaxpayerKind kind,
        TaxpayerSegment segment
    ) {
        super(taxpayerId);
        this.tin = tin;
        this.name = name;
        this.kind = kind;
        this.segment = segment;
    }
}
