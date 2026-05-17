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
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyReturnService {

    private final DailyReturnRepository dailyReturnRepository;

    private final LedgerService ledgerService;

    private final UserRepository userRepository;

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

        DailyReturn dailyReturn = DailyReturn.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .amount(request.getAmount())
                .description(request.getDescription())
                .attachmentName(request.getAttachmentName())
                .submissionDate(LocalDate.now())
                .user(user)
                .build();

        dailyReturnRepository.save(dailyReturn);

        ledgerService.updateLedger(
                request.getAmount()
        );

        return generateReceipt(dailyReturn);
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