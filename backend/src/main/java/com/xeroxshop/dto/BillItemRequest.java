package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillItemRequest {
    private UUID productId;
    private UUID serviceId;
    private int quantity;
    private BigDecimal unitPrice;
}
