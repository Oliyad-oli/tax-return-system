package com.taxsystem.backend.settings.dto;

import lombok.Data;

@Data
public class SettingsDTO {
    private String theme;
    private String language;
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean twoFactorEnabled;
    private Integer sessionTimeoutMinutes;
    private Boolean autoLogout;
}