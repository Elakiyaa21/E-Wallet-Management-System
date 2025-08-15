package com.examly.springapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data @AllArgsConstructor
public class AdminStats {
    private long totalUsers;
    private long totalTransactions;
    private BigDecimal totalFunds;
}
