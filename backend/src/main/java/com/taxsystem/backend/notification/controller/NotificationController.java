package com.taxsystem.backend.notification.controller;

import com.taxsystem.backend.notification.domain.Notification;
import com.taxsystem.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{email}")
    public List<Notification> getNotifications(
            @PathVariable String email
    ) {

        return service.getUserNotifications(email);
    }

    @PutMapping("/read/{id}")
    public void markAsRead(
            @PathVariable Long id
    ) {

        service.markAsRead(id);
    }
}