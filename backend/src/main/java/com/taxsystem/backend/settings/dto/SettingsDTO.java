package com.taxsystem.backend.settings.dto;

public class SettingsDTO {
    private String theme;
    private String language;
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean twoFactorEnabled;
    private Integer sessionTimeoutMinutes;
    private Boolean autoLogout;

    // Getters and Setters
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }
    
    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }
    
    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }
    
    public Integer getSessionTimeoutMinutes() { return sessionTimeoutMinutes; }
    public void setSessionTimeoutMinutes(Integer sessionTimeoutMinutes) { this.sessionTimeoutMinutes = sessionTimeoutMinutes; }
    
    public Boolean getAutoLogout() { return autoLogout; }
    public void setAutoLogout(Boolean autoLogout) { this.autoLogout = autoLogout; }
}