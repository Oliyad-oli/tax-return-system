package com.taxsystem.backend.notification.controller;

import com.taxsystem.backend.notification.domain.Notification;
import com.taxsystem.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{email}")
    public List<Notification> getNotifications(@PathVariable String email) {
        return service.getUserNotifications(email);
    }

    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }

    @GetMapping("/unread/{email}")
    public Map<String, Long> getUnreadCount(@PathVariable String email) {
        Map<String, Long> response = new HashMap<>();
        long count = service.getUserNotifications(email).stream().filter(n -> !n.isRead()).count();
        response.put("count", count);
        return response;
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
    }
}