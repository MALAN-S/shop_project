package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillRequest {
    private List<BillItemRequest> items;
    private BigDecimal discount;
    private String paymentMethod;
}
