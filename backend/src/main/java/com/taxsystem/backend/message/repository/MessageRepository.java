package com.taxsystem.backend.message.repository;

import com.taxsystem.backend.message.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByReceiverEmailOrderByCreatedAtDesc(String receiverEmail);
    
    List<Message> findBySenderEmailOrderByCreatedAtDesc(String senderEmail);
    
    List<Message> findByReceiverEmailAndIsReadFalse(String receiverEmail);
    
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiverEmail = :email AND m.isRead = false")
    void markAllAsRead(@Param("email") String email);
    
    @Query("SELECT m FROM Message m WHERE m.receiverEmail = :email OR m.senderEmail = :email ORDER BY m.createdAt DESC")
    List<Message> getAllUserConversations(@Param("email") String email);
    
    long countByReceiverEmailAndIsReadFalse(String receiverEmail);
}