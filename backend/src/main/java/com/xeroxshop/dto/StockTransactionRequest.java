package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockTransactionRequest {
    private UUID productId;
    private String type; // IN, OUT, ADJUST
    private int quantity;
    private String reference;
}
