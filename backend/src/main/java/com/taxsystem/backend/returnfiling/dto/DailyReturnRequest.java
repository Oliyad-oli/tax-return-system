package com.taxsystem.backend.returnfiling.dto;

public class DailyReturnRequest {
    private String email;
    private String invoiceNumber;
    private Double amount;
    private String description;
    private String attachmentName;
    private Boolean manualEntry;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }
    
    public Boolean getManualEntry() { return manualEntry; }
    public void setManualEntry(Boolean manualEntry) { this.manualEntry = manualEntry; }
}