package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue
    private Long id;

    @Column(precision = 19, scale = 4, nullable = false)
    private BigDecimal amount;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @ManyToOne
    @JoinColumn(name = "source_wallet_id")
    private Wallet sourceWallet;

    @ManyToOne
    @JoinColumn(name = "destination_wallet_id")
    private Wallet destinationWallet;

    // Keep your existing values for backward compatibility
    // and ADD SRS enum values (TOP_UP, TRANSFER_SENT, TRANSFER_RECEIVED)
    public enum TransactionType {
        DEPOSIT, TRANSFER, TOP_UP, TRANSFER_SENT, TRANSFER_RECEIVED
    }

    public enum TransactionStatus {
        SUCCESS, FAILED
    }
}
