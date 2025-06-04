package com.he180773.testreact.redis;


import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

@Service
public class CartServiceRedis {

    private final RedisTemplate<String, Object> redisTemplate;

    public CartServiceRedis(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String getCartKey(Long userId) {
        return "cart:" + userId;
    }

    public void addToCart(Long userId, Long productId, int quantity) {
        String key = getCartKey(userId);
        redisTemplate.opsForHash().increment(key, productId.toString(), quantity);
        Map<Object, Object> cartItems = redisTemplate.opsForHash().entries("cart:" + userId);
        for (Map.Entry<Object, Object> entry : cartItems.entrySet()) {
            System.out.println("Product ID: " + entry.getKey() + ", Quantity: " + entry.getValue());
        }
        redisTemplate.expire(key, Duration.ofDays(30));
    }

    public void updateQuantity(Long userId, Long productId, int quantity) {
        String key = getCartKey(userId);
        if (quantity <= 0) {
            redisTemplate.opsForHash().delete(key, productId.toString());
        } else {
            redisTemplate.opsForHash().put(key, productId.toString(), quantity);
        }
        redisTemplate.expire(key, Duration.ofDays(30));
    }

    public Map<Object, Object> getCart(Long userId) {
        System.out.println(redisTemplate.opsForHash().entries(getCartKey(userId)));
        return redisTemplate.opsForHash().entries(getCartKey(userId));
    }

    public void removeProduct(Long userId, Long productId) {
        redisTemplate.opsForHash().delete(getCartKey(userId), productId.toString());
    }

    public void clearCart(Long userId) {
        redisTemplate.delete(getCartKey(userId));
    }
}


