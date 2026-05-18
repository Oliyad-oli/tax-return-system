package com.taxsystem.backend.settings.repository;

import com.taxsystem.backend.settings.domain.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByEmail(String email);
    boolean existsByEmail(String email);
}