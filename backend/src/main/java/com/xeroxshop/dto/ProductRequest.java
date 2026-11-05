package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String name;
    private String sku;
    private String description;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private int currentStock;
    private int minStockLevel;
    private String imageUrl;
    private String status;
    private Integer categoryId;
}
