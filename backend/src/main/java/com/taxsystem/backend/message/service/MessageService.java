package com.taxsystem.backend.message.service;

import com.taxsystem.backend.message.domain.Message;
import com.taxsystem.backend.message.dto.MessageDTO;
import com.taxsystem.backend.message.repository.MessageRepository;
import com.taxsystem.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public Message sendMessage(MessageDTO request) {
        Message message = Message.builder()
                .senderEmail(request.getSenderEmail())
                .receiverEmail(request.getReceiverEmail())
                .subject(request.getSubject())
                .content(request.getContent())
                .isRead(false)
                .build();
        
        Message savedMessage = messageRepository.save(message);
        
        // Send notification to receiver
        notificationService.createNotification(
                request.getReceiverEmail(),
                "📧 New Message: " + request.getSubject(),
                "You have received a new message from " + request.getSenderEmail()
        );
        
        return savedMessage;
    }
    
    public List<Message> getUserMessages(String email) {
        return messageRepository.findByReceiverEmailOrderByCreatedAtDesc(email);
    }
    
    public List<Message> getUserSentMessages(String email) {
        return messageRepository.findBySenderEmailOrderByCreatedAtDesc(email);
    }
    
    public List<Message> getAllConversations(String email) {
        return messageRepository.getAllUserConversations(email);
    }
    
    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        messageRepository.save(message);
    }
    
    @Transactional
    public void markAllAsRead(String email) {
        messageRepository.markAllAsRead(email);
    }
    
    public long getUnreadCount(String email) {
        return messageRepository.countByReceiverEmailAndIsReadFalse(email);
    }
    
    @Transactional
    public Message replyToMessage(Long parentId, MessageDTO reply) {
        Message parentMessage = messageRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Original message not found"));
        
        Message replyMessage = Message.builder()
                .senderEmail(reply.getSenderEmail())
                .receiverEmail(parentMessage.getSenderEmail())
                .subject("RE: " + parentMessage.getSubject())
                .content(reply.getContent())
                .parentMessage(parentMessage)
                .isRead(false)
                .build();
        
        Message savedReply = messageRepository.save(replyMessage);
        
        notificationService.createNotification(
                parentMessage.getSenderEmail(),
                "📧 Reply to: " + parentMessage.getSubject(),
                "You have received a reply from " + reply.getSenderEmail()
        );
        
        return savedReply;
    }
}