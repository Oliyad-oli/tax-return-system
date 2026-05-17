package com.taxsystem.backend.returnfiling.dto;

import lombok.Data;

@Data
public class DailyReturnRequest {

    private String invoiceNumber;

    private Double amount;

    private String description;

    private Boolean manualEntry;

    private String justification;

    private String attachmentName;
}