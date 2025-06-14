package com.he180773.testreact.controller.admin;


import com.he180773.testreact.dto.ProductDTO;
import com.he180773.testreact.entity.Product;
import com.he180773.testreact.repository.ProductRepository;
import com.he180773.testreact.service.ProductService;
import com.he180773.testreact.service.SizeService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    private final SizeService sizeService;

    public AdminProductController(ProductService productService, ProductRepository productRepository,
                                  SizeService sizeService) {
        this.productService = productService;
        this.productRepository = productRepository;
        this.sizeService = sizeService;
    }

    @GetMapping("/tops")
    public ResponseEntity<Page<Product>> getTop( HttpServletResponse response,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Product> products= productRepository.findAllByCategory("top",pageable);
        if(products.getTotalPages()>0) {
            return ResponseEntity.ok(products);
        }
        return ResponseEntity.status(401).body(null);
    }

    @GetMapping("/bottoms")
    public ResponseEntity<Page<Product>> getBottom( HttpServletResponse response,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Product> products= productRepository.findAllByCategory("bottom",pageable);
        System.out.println(products);
        if(products.getTotalPages()>0) {
            return ResponseEntity.ok(products);
        }
        return ResponseEntity.status(401).body(null);
    }

    @GetMapping("/accessories")
    public ResponseEntity<Page<Product>> getAccessory( HttpServletResponse response,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Product> products= productRepository.findAllByCategory("accessory",pageable);
        if(products.getTotalPages()>0) {
            return ResponseEntity.ok(products);
        }
        return ResponseEntity.status(401).body(null);
    }


}
