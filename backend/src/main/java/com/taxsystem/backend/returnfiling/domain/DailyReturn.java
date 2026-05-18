package com.taxsystem.backend.returnfiling.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.taxsystem.backend.auth.domain.User;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "daily_returns")
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

    @JsonIgnoreProperties({
            "password"
    })

    private User user;
}