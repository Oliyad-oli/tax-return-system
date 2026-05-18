package com.taxsystem.backend.settings.service;

import com.taxsystem.backend.settings.domain.UserSettings;
import com.taxsystem.backend.settings.dto.SettingsDTO;
import com.taxsystem.backend.settings.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SettingsService {
    
    private final SettingsRepository settingsRepository;
    
    @Transactional
    public UserSettings getOrCreateSettings(String email) {
        return settingsRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserSettings newSettings = new UserSettings();
                    newSettings.setEmail(email);
                    newSettings.setTheme("light");
                    newSettings.setLanguage("en");
                    newSettings.setEmailNotifications(true);
                    newSettings.setSmsNotifications(false);
                    newSettings.setTwoFactorEnabled(false);
                    newSettings.setSessionTimeoutMinutes(30);
                    newSettings.setAutoLogout(true);
                    newSettings.setUpdatedAt(LocalDateTime.now());
                    return settingsRepository.save(newSettings);
                });
    }
    
    @Transactional
    public UserSettings updateSettings(String email, SettingsDTO settingsDTO) {
        UserSettings settings = getOrCreateSettings(email);
        
        if (settingsDTO.getTheme() != null) settings.setTheme(settingsDTO.getTheme());
        if (settingsDTO.getLanguage() != null) settings.setLanguage(settingsDTO.getLanguage());
        if (settingsDTO.getEmailNotifications() != null) settings.setEmailNotifications(settingsDTO.getEmailNotifications());
        if (settingsDTO.getSmsNotifications() != null) settings.setSmsNotifications(settingsDTO.getSmsNotifications());
        if (settingsDTO.getTwoFactorEnabled() != null) settings.setTwoFactorEnabled(settingsDTO.getTwoFactorEnabled());
        if (settingsDTO.getSessionTimeoutMinutes() != null) settings.setSessionTimeoutMinutes(settingsDTO.getSessionTimeoutMinutes());
        if (settingsDTO.getAutoLogout() != null) settings.setAutoLogout(settingsDTO.getAutoLogout());
        
        settings.setUpdatedAt(LocalDateTime.now());
        return settingsRepository.save(settings);
    }
}