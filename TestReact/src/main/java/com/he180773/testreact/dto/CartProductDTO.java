package com.he180773.testreact.dto;

import com.he180773.testreact.entity.Product;

import java.time.LocalDateTime;

public class CartProductDTO {

    private Long id;      // ID sản phẩm
    private String name;  // Tên sản phẩm
    private String image; // Link ảnh sản phẩm (nếu có)
    private Integer price;        // Giá sản phẩm
    private Integer quantity;    // Số lượng sản phẩm trong giỏ
    private String category;
    private LocalDateTime arrivedDate;

    // Constructor, getters và setters

    public CartProductDTO() {}

    public CartProductDTO(Product product, Integer quantity) {
        this.id = product.getId();
        this.name = product.getName();
        this.image = product.getImage();
        this.price = product.getPrice();
        this.quantity = quantity;
        this.category = product.getCategory();
        this.arrivedDate = product.getArrivedDate();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long productId) {
        this.id = productId;
    }

    public String getProductImage() {
        return image;
    }

    public void setProductImage(String productImage) {
        this.image = productImage;
    }

    public String getName() {
        return name;
    }

    public void setName(String productName) {
        this.name = productName;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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
