package com.taxsystem.backend.ledger.service;

import com.taxsystem.backend.ledger.domain.Ledger;
import com.taxsystem.backend.ledger.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    public void updateLedger(Double amount) {
        Ledger ledger = new Ledger();
        ledger.setAmount(amount);
        ledger.setTransactionDate(LocalDateTime.now());
        ledger.setDescription("Tax Return Submission");
        ledgerRepository.save(ledger);
    }
}