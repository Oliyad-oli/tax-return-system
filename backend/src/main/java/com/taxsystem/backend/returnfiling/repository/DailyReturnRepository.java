package com.taxsystem.backend.returnfiling.repository;

import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyReturnRepository extends JpaRepository<DailyReturn, Long> {
    
    List<DailyReturn> findByUserEmail(String email);
    
    List<DailyReturn> findByStatus(String status);
    
    List<DailyReturn> findByInspectionRequiredTrue();
}