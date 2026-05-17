package com.taxsystem.backend.ledger.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ledger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionType;

    private Double debit;

    private Double credit;

    private Double balance;
}