package com.taxsystem.backend.returnfiling.service;

import com.taxsystem.backend.ledger.service.LedgerService;
import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import com.taxsystem.backend.returnfiling.dto.DailyReturnRequest;
import com.taxsystem.backend.returnfiling.repository.DailyReturnRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DailyReturnService {

    private final DailyReturnRepository dailyReturnRepository;
    private final LedgerService ledgerService;

   public String submitReturn(DailyReturnRequest request) {

    if (request.getAmount() <= 0) {
        throw new RuntimeException(
                "Invalid Amount"
        );
    }

    if (
            request.getManualEntry() != null &&
            request.getManualEntry()
    ) {

        if (
                request.getJustification() == null ||
                request.getJustification().isEmpty()
        ) {

            throw new RuntimeException(
                    "Justification Required For Manual Entry"
            );
        }
    }

    if (
            request.getAttachmentName() == null ||
            request.getAttachmentName().isEmpty()
    ) {

        throw new RuntimeException(
                "Attachment Required"
        );
    }

    DailyReturn dailyReturn = DailyReturn.builder()
            .invoiceNumber(request.getInvoiceNumber())
            .amount(request.getAmount())
            .description(request.getDescription())
            .attachmentName(request.getAttachmentName())
            .submissionDate(LocalDate.now())
            .build();

    dailyReturnRepository.save(dailyReturn);

    ledgerService.updateLedger(request.getAmount());

    return generateReceipt(dailyReturn);
}

    public List<DailyReturn> getAllReturns() {
        return dailyReturnRepository.findAll();
    }


    private String generateReceipt(
        DailyReturn dailyReturn
) {

    return """
            =========================
            DAILY RETURN RECEIPT
            =========================
            Invoice: %s
            Amount: %s
            Date: %s
            Status: SUCCESS
            =========================
            """
            .formatted(
                    dailyReturn.getInvoiceNumber(),
                    dailyReturn.getAmount(),
                    dailyReturn.getSubmissionDate()
            );
}
    

 
    
}