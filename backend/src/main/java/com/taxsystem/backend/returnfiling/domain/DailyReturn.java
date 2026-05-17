package com.taxsystem.backend.returnfiling.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.taxsystem.backend.auth.domain.User;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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

    @ManyToOne
    @JoinColumn(name = "user_id")

    @JsonIgnoreProperties({
            "password"
    })

    private User user;
}