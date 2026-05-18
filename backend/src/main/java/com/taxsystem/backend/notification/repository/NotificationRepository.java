package com.taxsystem.backend.notification.repository;

import com.taxsystem.backend.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByEmailOrderByIdDesc(String email);
    
    List<Notification> findByEmailOrderByCreatedAtDesc(String email);
    
    List<Notification> findByEmailAndReadFalse(String email);
}