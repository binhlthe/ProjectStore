package com.he180773.testreact.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "[Productsize]")
public class ProductSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRODUCT_ID", nullable = false, columnDefinition = "Numeric(18)")
    private Long pid;
    @Column(name = "SIZE_ID", nullable = false, columnDefinition = "Numeric(18)")
    private Long sid;
    @Column(name = "STOCK")
    private Long stock;
    @Column(name = "PRICE_OVERIDE")
    private Long priceOverride;

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public Long getPriceOverride() {
        return priceOverride;
    }

    public void setPriceOverride(Long priceOverride) {
        this.priceOverride = priceOverride;
    }
}
