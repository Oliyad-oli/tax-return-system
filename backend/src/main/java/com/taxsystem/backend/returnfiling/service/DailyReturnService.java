package com.taxsystem.backend.returnfiling.service;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.repository.UserRepository;
import com.taxsystem.backend.ledger.service.LedgerService;
import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import com.taxsystem.backend.returnfiling.dto.DailyReturnRequest;
import com.taxsystem.backend.returnfiling.repository.DailyReturnRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DailyReturnService {

    private final DailyReturnRepository dailyReturnRepository;

    private final LedgerService ledgerService;

    private final UserRepository userRepository;

    private final EInvoiceService eInvoiceService;

    public String submitReturn(
        DailyReturnRequest request
) {

    if (request.getAmount() <= 0) {

        throw new RuntimeException(
                "Invalid Amount"
        );
    }

    if (
            request.getAttachmentName() == null ||
            request.getAttachmentName().isEmpty()
    ) {

        throw new RuntimeException(
                "Attachment Required"
        );
    }

    User user = userRepository.findByEmail(
            request.getEmail()
    ).orElseThrow(() ->
            new RuntimeException("User not found")
    );

    String status = "APPROVED";

    String notification =
            "Return Submitted Successfully";

    String validationMessage =
            "Invoice Successfully Validated";

    String riskLevel = "LOW";

    Boolean validated = true;

    Boolean inspectionRequired = false;

    Map<String, Object> invoiceData =
            eInvoiceService.getInvoiceData(
                    request.getInvoiceNumber()
            );

    Double originalAmount =
            Double.valueOf(
                    invoiceData.get("amount").toString()
            );

    if (
            !originalAmount.equals(
                    request.getAmount()
            )
    ) {

        status = "REJECTED";

        validated = false;

        riskLevel = "HIGH";

        validationMessage =
                "Invoice Amount Mismatch";

        notification =
                "Invoice Validation Failed";
    }

    if (
            request.getManualEntry() != null &&
            request.getManualEntry()
    ) {

        status = "FLAGGED";

        inspectionRequired = true;

        riskLevel = "MEDIUM";

        notification =
                "Return Requires Inspection";

        validationMessage =
                "Manual Entry Detected";
    }

    DailyReturn dailyReturn = DailyReturn.builder()

            .invoiceNumber(
                    request.getInvoiceNumber()
            )

            .amount(
                    request.getAmount()
            )

            .description(
                    request.getDescription()
            )

            .attachmentName(
                    request.getAttachmentName()
            )

            .submissionDate(
                    LocalDate.now()
            )

            .manualEntry(
                    request.getManualEntry()
            )

            .status(status)

            .notificationMessage(
                    notification
            )

            .invoiceValidated(
                    validated
            )

            .inspectionRequired(
                    inspectionRequired
            )

            .validationMessage(
                    validationMessage
            )

            .riskLevel(
                    riskLevel
            )

            .createdAt(
                    LocalDateTime.now()
            )

            .user(user)

            .build();

    dailyReturnRepository.save(
            dailyReturn
    );

    ledgerService.updateLedger(
            request.getAmount()
    );

    return generateReceipt(
            dailyReturn
    );
}

    public List<DailyReturn> getUserReturns(
            String email
    ) {

        return dailyReturnRepository
                .findByUserEmail(email);
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
                Status: %s
                Message: %s
                =========================
                """
                .formatted(
                        dailyReturn.getInvoiceNumber(),
                        dailyReturn.getAmount(),
                        dailyReturn.getSubmissionDate(),
                        dailyReturn.getStatus(),
                        dailyReturn.getNotificationMessage()
                );
    }
}