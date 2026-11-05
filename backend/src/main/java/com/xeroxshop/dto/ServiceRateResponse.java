package com.xeroxshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRateResponse {
    private UUID id;
    private UUID serviceId;
    private String serviceName;
    private String paperSize;
    private String sides;
    private BigDecimal pricePerPage;
    private boolean active;
}
