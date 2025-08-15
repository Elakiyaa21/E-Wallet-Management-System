package com.examly.springapp.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String recipientEmail; // or recipientId if you prefer
    private Long recipientId;      // optional
    private BigDecimal amount;
}
