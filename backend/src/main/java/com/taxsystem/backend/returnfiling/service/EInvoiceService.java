package com.taxsystem.backend.returnfiling.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class EInvoiceService {

    public Map<String, Object> getInvoiceData(
            String invoiceNumber
    ) {

        Map<String, Object> invoice = new HashMap<>();

        invoice.put("invoiceNumber", invoiceNumber);
        invoice.put("amount", 8000.0);
        invoice.put("description", "Validated E-Invoice Sale");

        return invoice;
    }
}