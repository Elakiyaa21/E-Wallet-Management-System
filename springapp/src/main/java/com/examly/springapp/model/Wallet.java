package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Wallet {
    @Id
    @GeneratedValue
    private Long walletId;

    private String walletName;
    private double balance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "sourceWallet", cascade = CascadeType.ALL)
    private List<Transaction> outgoingTransactions;

    @OneToMany(mappedBy = "destinationWallet", cascade = CascadeType.ALL)
    private List<Transaction> incomingTransactions;
}
