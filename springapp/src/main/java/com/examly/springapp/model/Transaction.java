package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    public enum TransactionType {
        DEPOSIT, TRANSFER
    }

    public enum TransactionStatus {
        SUCCESS, FAILED
    }

    @Id
    @GeneratedValue
    private Long transactionId;

    private double amount;
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @ManyToOne
    private Wallet sourceWallet;

    @ManyToOne
    private Wallet destinationWallet;
}
