package com.examly.springapp.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopUpRequest {
    private BigDecimal amount;
}
