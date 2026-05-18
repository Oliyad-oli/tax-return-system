package com.taxsystem.backend.settings.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Builder.Default
    private String theme = "light";
    
    @Builder.Default
    private String language = "en";
    
    @Builder.Default
    private Boolean emailNotifications = true;
    
    @Builder.Default
    private Boolean smsNotifications = false;
    
    @Builder.Default
    private Boolean twoFactorEnabled = false;
    
    @Builder.Default
    private Integer sessionTimeoutMinutes = 30;
    
    @Builder.Default
    private Boolean autoLogout = true;
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}