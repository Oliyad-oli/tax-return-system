package com.taxsystem.backend.returnfiling.repository;

import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyReturnRepository extends JpaRepository<DailyReturn, Long> {
    
    List<DailyReturn> findByUserEmail(String email);
    
    List<DailyReturn> findByStatus(String status);
    
    List<DailyReturn> findByInspectionRequiredTrue();
    
    List<DailyReturn> findTop5ByOrderByIdDesc();
    
    @Query(value = "SELECT TO_CHAR(d.submission_date, 'Mon YYYY') as month, COUNT(*), COALESCE(SUM(d.amount), 0) " +
           "FROM daily_return d " +
           "WHERE d.status = 'APPROVED' " +
           "GROUP BY TO_CHAR(d.submission_date, 'Mon YYYY') " +
           "ORDER BY MIN(d.submission_date) DESC " +
           "LIMIT 6", nativeQuery = true)
    List<Object[]> getMonthlyReturnCounts();
}