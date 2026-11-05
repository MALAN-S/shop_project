package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
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
    private String categoryName;
    private boolean lowStock;
}
