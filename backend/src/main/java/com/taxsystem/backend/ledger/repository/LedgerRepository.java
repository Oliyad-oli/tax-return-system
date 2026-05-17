package com.taxsystem.backend.ledger.repository;

import com.taxsystem.backend.ledger.domain.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LedgerRepository
        extends JpaRepository<Ledger, Long> {
}