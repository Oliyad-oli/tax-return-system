package com.taxsystem.backend.settings.controller;

import com.taxsystem.backend.settings.domain.UserSettings;
import com.taxsystem.backend.settings.dto.SettingsDTO;
import com.taxsystem.backend.settings.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SettingsController {
    
    private final SettingsService settingsService;
    
    @GetMapping("/{email}")
    public UserSettings getSettings(@PathVariable String email) {
        return settingsService.getOrCreateSettings(email);
    }
    
    @PutMapping("/{email}")
    public UserSettings updateSettings(@PathVariable String email, @RequestBody SettingsDTO settingsDTO) {
        return settingsService.updateSettings(email, settingsDTO);
    }
}