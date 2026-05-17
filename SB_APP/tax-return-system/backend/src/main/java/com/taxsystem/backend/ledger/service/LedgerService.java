package com.taxsystem.backend.ledger.service;

import com.taxsystem.backend.ledger.domain.Ledger;
import com.taxsystem.backend.ledger.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    public void updateLedger(Double amount) {

        Ledger ledger = Ledger.builder()
                .transactionType("DAILY_RETURN")
                .debit(amount)
                .credit(0.0)
                .balance(amount)
                .build();

        ledgerRepository.save(ledger);
    }
}