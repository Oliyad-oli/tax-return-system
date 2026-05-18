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

    public List<Notification> getUserNotifications(
            String email
    ) {

        return repository.findByEmailOrderByIdDesc(email);
    }

    public Notification save(Notification notification) {

        return repository.save(notification);
    }

    public void markAsRead(Long id) {

        Notification notification =
                repository.findById(id).orElseThrow();

        notification.setRead(true);

        repository.save(notification);
    }

    // ADD THIS METHOD - It's missing!
    public void createNotification(
            String email,
            String title,
            String message
    ) {

        Notification notification = Notification.builder()
                .email(email)
                .title(title)
                .message(message)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(notification);
    }
}