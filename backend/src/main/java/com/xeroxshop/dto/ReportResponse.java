package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private BigDecimal totalSales;
    private int totalBills;
    private BigDecimal xeroxSales;
    private BigDecimal colorPrintSales;
    private BigDecimal stationerySales;
    private BigDecimal cashSales;
    private BigDecimal upiSales;
    private BigDecimal cardSales;
    private List<DailySales> dailySales;
}
