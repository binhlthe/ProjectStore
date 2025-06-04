package com.he180773.testreact.controller.client;


import com.he180773.testreact.dto.CartProductDTO;
import com.he180773.testreact.entity.Product;
import com.he180773.testreact.redis.CartServiceRedis;
import com.he180773.testreact.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartServiceRedis cartService;
    private final ProductRepository productRepository;

    public CartController(CartServiceRedis cartService, ProductRepository productRepository) {
        this.productRepository = productRepository;
        this.cartService = cartService;
    }

    @GetMapping("/get")
    public List<CartProductDTO> getCart(@RequestParam Long userId) {
        Map<Object, Object> cartMap = cartService.getCart(userId); // Lấy map productId -> quantity từ Redis

        List<Long> productIds = cartMap.keySet().stream()
                .map(Object::toString)
                .map(Long::parseLong)
                .collect(Collectors.toList());

        // Lấy chi tiết sản phẩm từ DB
        List<Product> products = productRepository.findAllById(productIds);

        // Ghép số lượng vào đối tượng DTO
        List<CartProductDTO> cartProducts = products.stream()
                .map(p -> {
                    Integer quantity = Integer.parseInt(cartMap.get(p.getId().toString()).toString());
                    return new CartProductDTO(p, quantity);
                })
                .collect(Collectors.toList());

        return cartProducts;
    }

    @GetMapping("/add")
    public void addToCart(@RequestParam(required = false) Long userId,
                          @RequestParam(required = false) Long productId,
                          @RequestParam int quantity) {
        System.out.println("productID: "+productId);
        System.out.println("quantity: "+quantity);
        System.out.println("addToCart");
        cartService.addToCart(userId, productId, quantity);
    }

    @PostMapping("/update")
    public void updateQuantity(@RequestParam Long userId,
                               @RequestParam Long productId,
                               @RequestParam int quantity) {
        cartService.updateQuantity(userId, productId, quantity);
    }

    @DeleteMapping("/remove")
    public void removeProduct(@RequestParam Long userId,
                              @RequestParam Long productId) {
        cartService.removeProduct(userId, productId);
    }

    @DeleteMapping("/clear")
    public void clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
    }
}
