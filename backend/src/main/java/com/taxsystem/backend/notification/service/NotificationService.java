package com.taxsystem.backend.notification.service;

import com.taxsystem.backend.notification.domain.Notification;
import com.taxsystem.backend.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public List<Notification> getUserNotifications(String email) {
        return repository.findByEmailOrderByIdDesc(email);
    }

    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    public void markAsRead(Long id) {
        Notification notification = repository.findById(id).orElseThrow();
        notification.setRead(true);
        repository.save(notification);
    }

    public void createNotification(String email, String title, String message) {
        Notification notification = new Notification();
        notification.setEmail(email);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        repository.save(notification);
    }

    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }
}