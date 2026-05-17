package com.taxsystem.backend.ledger.service;

import com.taxsystem.backend.ledger.domain.Ledger;
import com.taxsystem.backend.ledger.repository.LedgerRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    public void updateLedger(
            Double amount
    ) {

        Ledger ledger = Ledger.builder()
                .amount(amount)
                .transactionType("DEBIT")
                .transactionDate(LocalDate.now())
                .build();

        ledgerRepository.save(ledger);
    }
}