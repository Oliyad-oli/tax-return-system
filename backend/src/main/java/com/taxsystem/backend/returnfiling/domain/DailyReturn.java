package com.taxsystem.backend.returnfiling.domain;

import com.taxsystem.backend.auth.domain.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class DailyReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String invoiceNumber;
    private Double amount;
    private String description;
    private String attachmentName;
    private LocalDate submissionDate;
    private Boolean manualEntry;
    private String status;
    private String notificationMessage;
    private Boolean invoiceValidated;
    private Boolean inspectionRequired;
    private String validationMessage;
    private String riskLevel;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }
    
    public LocalDate getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDate submissionDate) { this.submissionDate = submissionDate; }
    
    public Boolean getManualEntry() { return manualEntry; }
    public void setManualEntry(Boolean manualEntry) { this.manualEntry = manualEntry; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getNotificationMessage() { return notificationMessage; }
    public void setNotificationMessage(String notificationMessage) { this.notificationMessage = notificationMessage; }
    
    public Boolean getInvoiceValidated() { return invoiceValidated; }
    public void setInvoiceValidated(Boolean invoiceValidated) { this.invoiceValidated = invoiceValidated; }
    
    public Boolean getInspectionRequired() { return inspectionRequired; }
    public void setInspectionRequired(Boolean inspectionRequired) { this.inspectionRequired = inspectionRequired; }
    
    public String getValidationMessage() { return validationMessage; }
    public void setValidationMessage(String validationMessage) { this.validationMessage = validationMessage; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}