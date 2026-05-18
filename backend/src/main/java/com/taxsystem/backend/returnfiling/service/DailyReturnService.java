package com.taxsystem.backend.returnfiling.service;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.repository.UserRepository;
import com.taxsystem.backend.ledger.service.LedgerService;
import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import com.taxsystem.backend.returnfiling.dto.DailyReturnRequest;
import com.taxsystem.backend.returnfiling.repository.DailyReturnRepository;
import com.taxsystem.backend.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DailyReturnService {
    
    private final NotificationService notificationService;
    private final DailyReturnRepository dailyReturnRepository;
    private final LedgerService ledgerService;
    private final UserRepository userRepository;
    private final EInvoiceService eInvoiceService;

    public String submitReturn(DailyReturnRequest request) {

        if (request.getAmount() <= 0) {
            throw new RuntimeException("Invalid Amount");
        }

        if (request.getAttachmentName() == null || request.getAttachmentName().isEmpty()) {
            throw new RuntimeException("Attachment Required");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String status = "APPROVED";
        String notification = "Return Submitted Successfully";
        String validationMessage = "Invoice Successfully Validated";
        String riskLevel = "LOW";
        Boolean validated = true;
        Boolean inspectionRequired = false;

        Map<String, Object> invoiceData = eInvoiceService.getInvoiceData(request.getInvoiceNumber());

        Double originalAmount = Double.valueOf(invoiceData.get("amount").toString());

        if (!originalAmount.equals(request.getAmount())) {
            status = "REJECTED";
            validated = false;
            riskLevel = "HIGH";
            validationMessage = "Invoice Amount Mismatch";
            notification = "Invoice Validation Failed - Amount Mismatch";
        }

        if (request.getManualEntry() != null && request.getManualEntry()) {
            status = "FLAGGED";
            inspectionRequired = true;
            riskLevel = "MEDIUM";
            notification = "Return Requires Inspection - Manual Entry Detected";
            validationMessage = "Manual Entry Detected - Awaiting Admin Review";
        }

        DailyReturn dailyReturn = DailyReturn.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .amount(request.getAmount())
                .description(request.getDescription())
                .attachmentName(request.getAttachmentName())
                .submissionDate(LocalDate.now())
                .manualEntry(request.getManualEntry())
                .status(status)
                .notificationMessage(notification)
                .invoiceValidated(validated)
                .inspectionRequired(inspectionRequired)
                .validationMessage(validationMessage)
                .riskLevel(riskLevel)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        dailyReturnRepository.save(dailyReturn);
        
        // Create notification based on status
        if (status.equals("APPROVED")) {
            notificationService.createNotification(
                    request.getEmail(),
                    "✅ Return Approved",
                    "Your daily return of $" + request.getAmount() + " has been APPROVED. Receipt ID: " + dailyReturn.getId()
            );
        } else if (status.equals("REJECTED")) {
            notificationService.createNotification(
                    request.getEmail(),
                    "❌ Return Rejected",
                    "Your daily return of $" + request.getAmount() + " was REJECTED. Reason: " + validationMessage
            );
        } else if (status.equals("FLAGGED")) {
            notificationService.createNotification(
                    request.getEmail(),
                    "⚠️ Return Flagged for Review",
                    "Your daily return of $" + request.getAmount() + " requires ADMIN inspection. Please check back later."
            );
            
            // Also notify all admins about flagged return
            notifyAdminsAboutFlaggedReturn(user.getFullName(), request.getAmount(), dailyReturn.getId());
        }

        ledgerService.updateLedger(request.getAmount());

        return generateReceipt(dailyReturn);
    }

    public List<DailyReturn> getUserReturns(String email) {
        return dailyReturnRepository.findByUserEmail(email);
    }
    
    public List<DailyReturn> getAllReturns() {
        return dailyReturnRepository.findAll();
    }
    
    public List<DailyReturn> getFlaggedReturns() {
        return dailyReturnRepository.findByStatus("FLAGGED");
    }
    
    public DailyReturn reviewReturn(Long returnId, String adminAction, String adminComment) {
        DailyReturn dailyReturn = dailyReturnRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return not found"));
        
        if (adminAction.equals("APPROVE")) {
            dailyReturn.setStatus("APPROVED");
            dailyReturn.setInspectionRequired(false);
            dailyReturn.setValidationMessage("Approved by Admin: " + adminComment);
            
            notificationService.createNotification(
                    dailyReturn.getUser().getEmail(),
                    "✅ Return Approved After Review",
                    "Your flagged return of $" + dailyReturn.getAmount() + " has been APPROVED by admin. Comment: " + adminComment
            );
        } else if (adminAction.equals("REJECT")) {
            dailyReturn.setStatus("REJECTED");
            dailyReturn.setValidationMessage("Rejected by Admin: " + adminComment);
            
            notificationService.createNotification(
                    dailyReturn.getUser().getEmail(),
                    "❌ Return Rejected After Review",
                    "Your flagged return of $" + dailyReturn.getAmount() + " has been REJECTED by admin. Reason: " + adminComment
            );
        }
        
        return dailyReturnRepository.save(dailyReturn);
    }

    private void notifyAdminsAboutFlaggedReturn(String taxpayerName, Double amount, Long returnId) {
        List<User> admins = userRepository.findByRole("ADMIN");
        
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getEmail(),
                    "🚨 Flagged Return Needs Review",
                    "Taxpayer " + taxpayerName + " submitted a flagged return of $" + amount + ". Return ID: " + returnId
            );
        }
    }

    private String generateReceipt(DailyReturn dailyReturn) {
        return """
                =========================
                DAILY RETURN RECEIPT
                =========================
                Receipt ID: %d
                Invoice: %s
                Amount: $%.2f
                Date: %s
                Status: %s
                Risk Level: %s
                Message: %s
                Validation: %s
                =========================
                """
                .formatted(
                        dailyReturn.getId(),
                        dailyReturn.getInvoiceNumber(),
                        dailyReturn.getAmount(),
                        dailyReturn.getSubmissionDate(),
                        dailyReturn.getStatus(),
                        dailyReturn.getRiskLevel(),
                        dailyReturn.getNotificationMessage(),
                        dailyReturn.getValidationMessage()
                );
    }
}