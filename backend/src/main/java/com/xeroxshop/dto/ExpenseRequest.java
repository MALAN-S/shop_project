package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String description;
    private String paymentMethod;
}
