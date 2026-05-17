package com.taxsystem.backend.returnfiling.repository;

import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyReturnRepository
        extends JpaRepository<DailyReturn, Long> {
}