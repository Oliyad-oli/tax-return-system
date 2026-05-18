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
        Message message = new Message();
        message.setSenderEmail(request.getSenderEmail());
        message.setReceiverEmail(request.getReceiverEmail());
        message.setSubject(request.getSubject());
        message.setContent(request.getContent());
        message.setRead(false);
        
        Message savedMessage = messageRepository.save(message);
        
        notificationService.createNotification(
            request.getReceiverEmail(),
            "New Message: " + request.getSubject(),
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
        Message message = messageRepository.findById(messageId).orElseThrow();
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
        Message parentMessage = messageRepository.findById(parentId).orElseThrow();
        
        Message replyMessage = new Message();
        replyMessage.setSenderEmail(reply.getSenderEmail());
        replyMessage.setReceiverEmail(parentMessage.getSenderEmail());
        replyMessage.setSubject("RE: " + parentMessage.getSubject());
        replyMessage.setContent(reply.getContent());
        replyMessage.setParentMessage(parentMessage);
        replyMessage.setRead(false);
        
        Message savedReply = messageRepository.save(replyMessage);
        
        notificationService.createNotification(
            parentMessage.getSenderEmail(),
            "Reply to: " + parentMessage.getSubject(),
            "You have received a reply from " + reply.getSenderEmail()
        );
        
        return savedReply;
    }
}