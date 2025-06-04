package com.he180773.testreact.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "[Product]")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false, columnDefinition = "Numeric(18)")
    private Long id;
    @Column(name = "NAME", length = 50)
    private String name;
    @Column(name = "PRICE", nullable = false, columnDefinition = "Numeric(18)")
    private Integer price;
    @Column(name = "IMAGE", length = 255)
    private String image;
    @Column(name = "CATEGORY", length = 50)
    private String category;
    @Column(name = "ARRIVED_DATE")
    private LocalDateTime arrivedDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getArrivedDate() {
        return arrivedDate;
    }

    public void setArrivedDate(LocalDateTime arrivedDate) {
        this.arrivedDate = arrivedDate;
    }
}
