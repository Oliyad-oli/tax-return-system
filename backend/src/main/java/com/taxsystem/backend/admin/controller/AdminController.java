package com.taxsystem.backend.admin.controller;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.repository.UserRepository;
import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import com.taxsystem.backend.returnfiling.repository.DailyReturnRepository;
import com.taxsystem.backend.notification.service.NotificationService;
import com.taxsystem.backend.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;
    private final DailyReturnRepository dailyReturnRepository;
    private final NotificationService notificationService;
    private final MessageService messageService;

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

    @GetMapping("/dashboard-stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalReturns = dailyReturnRepository.count();
        long flaggedReturns = dailyReturnRepository.findByStatus("FLAGGED").size();
        long rejectedReturns = dailyReturnRepository.findByStatus("REJECTED").size();
        long approvedReturns = dailyReturnRepository.findByStatus("APPROVED").size();
        
        List<Map<String, Object>> chartData = new ArrayList<>();
        
        stats.put("totalReturns", totalReturns);
        stats.put("flaggedReturns", flaggedReturns);
        stats.put("rejectedReturns", rejectedReturns);
        stats.put("approvedReturns", approvedReturns);
        stats.put("chartData", chartData);
        
        List<DailyReturn> recentReturns = dailyReturnRepository.findTop5ByOrderByIdDesc();
        stats.put("recentReturns", recentReturns != null ? recentReturns : new ArrayList<>());
        
        return stats;
    }

    @GetMapping("/taxpayer-stats/{email}")
    public Map<String, Object> getTaxpayerStats(@PathVariable String email) {
        Map<String, Object> stats = new HashMap<>();
        
        List<DailyReturn> userReturns = dailyReturnRepository.findByUserEmail(email);
        
        long totalSubmitted = userReturns.size();
        long approved = 0;
        long rejected = 0;
        long flagged = 0;
        double totalAmount = 0;
        
        for (DailyReturn r : userReturns) {
            if ("APPROVED".equals(r.getStatus())) {
                approved++;
                totalAmount += r.getAmount();
            } else if ("REJECTED".equals(r.getStatus())) {
                rejected++;
            } else if ("FLAGGED".equals(r.getStatus())) {
                flagged++;
            }
        }
        
        stats.put("totalSubmitted", totalSubmitted);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        stats.put("flagged", flagged);
        stats.put("totalAmount", totalAmount);
        
        List<DailyReturn> recentReturns = userReturns.stream().limit(5).toList();
        stats.put("recentReturns", recentReturns);
        
        long unreadNotifications = notificationService.getUserNotifications(email).stream().filter(n -> !n.isRead()).count();
        stats.put("unreadNotifications", unreadNotifications);
        
        long unreadMessages = messageService.getUnreadCount(email);
        stats.put("unreadMessages", unreadMessages);
        
        return stats;
    }
}