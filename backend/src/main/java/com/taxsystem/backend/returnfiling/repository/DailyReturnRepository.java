package com.taxsystem.backend.returnfiling.repository;

import com.taxsystem.backend.returnfiling.domain.DailyReturn;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyReturnRepository
        extends JpaRepository<DailyReturn, Long> {

    List<DailyReturn> findByUserEmail(
            String email
    );
}