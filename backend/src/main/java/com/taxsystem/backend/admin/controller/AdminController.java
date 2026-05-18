package com.taxsystem.backend.admin.controller;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.repository.UserRepository;
import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import com.taxsystem.backend.returnfiling.repository.DailyReturnRepository;
import com.taxsystem.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;
    private final DailyReturnRepository dailyReturnRepository;
    private final NotificationService notificationService;

    @GetMapping("/taxpayers")
    public List<User> getAllTaxpayers() {
        return userRepository.findByRole("TAXPAYER");
    }

    @DeleteMapping("/taxpayers/{id}")
    public void deleteTaxpayer(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @PutMapping("/taxpayers/{id}/reset-password")
    public void resetPassword(@PathVariable Long id, @RequestParam String newPassword) {
        User user = userRepository.findById(id).orElseThrow();
        user.setPassword(newPassword);
        userRepository.save(user);
        
        notificationService.createNotification(
            user.getEmail(),
            "Password Reset",
            "Your password has been reset by admin. Please login with your new password."
        );
    }

    @GetMapping("/all-returns")
    public List<DailyReturn> getAllReturns() {
        return dailyReturnRepository.findAll();
    }

    @PutMapping("/returns/{id}/status")
    public void updateReturnStatus(@PathVariable Long id, 
                                   @RequestParam String status,
                                   @RequestParam String comment) {
        DailyReturn dailyReturn = dailyReturnRepository.findById(id).orElseThrow();
        dailyReturn.setStatus(status);
        dailyReturn.setValidationMessage(comment);
        dailyReturnRepository.save(dailyReturn);
        
        notificationService.createNotification(
            dailyReturn.getUser().getEmail(),
            "Return " + status,
            "Your return (Invoice: " + dailyReturn.getInvoiceNumber() + ") has been " + 
            status + ". Comment: " + comment
        );
    }

    @GetMapping("/flagged-count")
    public Map<String, Long> getFlaggedCount() {
        Map<String, Long> response = new HashMap<>();
        long count = dailyReturnRepository.findByStatus("FLAGGED").size();
        response.put("count", count);
        return response;
    }
}