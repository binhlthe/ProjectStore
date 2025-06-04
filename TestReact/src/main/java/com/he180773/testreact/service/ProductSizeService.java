package com.he180773.testreact.service;


import com.he180773.testreact.entity.ProductSize;
import com.he180773.testreact.repository.ProductSizeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSizeService {

    private final ProductSizeRepository productSizeRepository;

    public ProductSizeService(ProductSizeRepository productSizeRepository) {
        this.productSizeRepository = productSizeRepository;
    }

    public List<Long> getSizeByProductId(Long productId) {
        return productSizeRepository.findSidByPid(productId);
    }
}
