package com.taxsystem.backend.message.controller;

import com.taxsystem.backend.message.domain.Message;
import com.taxsystem.backend.message.dto.MessageDTO;
import com.taxsystem.backend.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MessageController {
    
    private final MessageService messageService;

    @PostMapping("/send")
    public Message sendMessage(@RequestBody MessageDTO request) {
        return messageService.sendMessage(request);
    }
    
    @GetMapping("/inbox/{email}")
    public List<Message> getInbox(@PathVariable String email) {
        return messageService.getUserMessages(email);
    }
    
    @GetMapping("/sent/{email}")
    public List<Message> getSentMessages(@PathVariable String email) {
        return messageService.getUserSentMessages(email);
    }
    
    @GetMapping("/conversations/{email}")
    public List<Message> getAllConversations(@PathVariable String email) {
        return messageService.getAllConversations(email);
    }
    
    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
    }
    
    @PutMapping("/read-all/{email}")
    public void markAllAsRead(@PathVariable String email) {
        messageService.markAllAsRead(email);
    }
    
    @GetMapping("/unread/{email}")
    public Map<String, Long> getUnreadCount(@PathVariable String email) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", messageService.getUnreadCount(email));
        return response;
    }
    
    @PostMapping("/reply/{parentId}")
    public Message replyToMessage(@PathVariable Long parentId, @RequestBody MessageDTO reply) {
        return messageService.replyToMessage(parentId, reply);
    }
}