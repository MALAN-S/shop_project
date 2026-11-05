package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private BigDecimal todaySales;
    private int todayBills;
    private BigDecimal xeroxSales;
    private BigDecimal colorPrintSales;
    private BigDecimal stationerySales;
    private BigDecimal totalExpenses;
    private BigDecimal estimatedProfit;
    private List<ProductResponse> lowStockProducts;
    private List<BillResponse> recentTransactions;
}
