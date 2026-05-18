package com.taxsystem.backend.message.dto;

import lombok.Data;

@Data
public class MessageDTO {
    private String senderEmail;
    private String receiverEmail;
    private String subject;
    private String content;
}