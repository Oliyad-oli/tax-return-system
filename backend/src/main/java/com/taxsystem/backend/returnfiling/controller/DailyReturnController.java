package com.taxsystem.backend.returnfiling.controller;

import com.taxsystem.backend.returnfiling.domain.DailyReturn;
import com.taxsystem.backend.returnfiling.dto.DailyReturnRequest;
import com.taxsystem.backend.returnfiling.service.DailyReturnService;
import com.taxsystem.backend.returnfiling.service.EInvoiceService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DailyReturnController {

    private final DailyReturnService dailyReturnService;

    private final EInvoiceService eInvoiceService;

    @PostMapping
    public String submitReturn(
            @RequestBody DailyReturnRequest request
    ) {

        return dailyReturnService
                .submitReturn(request);
    }

    @GetMapping("/{email}")
    public List<DailyReturn> getUserReturns(
            @PathVariable String email
    ) {

        return dailyReturnService
                .getUserReturns(email);
    }

    @GetMapping("/einvoice/{invoiceNumber}")
    public Map<String, Object> getInvoiceData(
            @PathVariable String invoiceNumber
    ) {

        return eInvoiceService
                .getInvoiceData(invoiceNumber);
    }
}