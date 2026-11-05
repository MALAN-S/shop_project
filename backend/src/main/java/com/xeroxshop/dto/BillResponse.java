package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillResponse {
    private UUID id;
    private String billNumber;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal grandTotal;
    private String paymentMethod;
    private String status;
    private OffsetDateTime createdAt;
    private List<BillItemResponse> items;
}
