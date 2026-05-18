package com.taxsystem.backend.returnfiling.dto;

import lombok.Data;

@Data
public class DailyReturnRequest {
    private String email;
    private String invoiceNumber;
    private Double amount;
    private String description;
    private String attachmentName;
    private Boolean manualEntry;
}