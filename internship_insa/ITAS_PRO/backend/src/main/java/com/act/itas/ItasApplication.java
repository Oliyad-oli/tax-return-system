package com.act.itas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ITAS - Integrated Tax Administration System
 * Main application entry point following bs-filing-core-server architecture.
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class ItasApplication {

    public static void main(String[] args) {
        SpringApplication.run(ItasApplication.class, args);
    }
}
