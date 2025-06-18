package com.he180773.testreact.service;


import com.he180773.testreact.entity.Order;
import com.he180773.testreact.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void updateStatus(Long orderId, String status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
        });
    }

    public List<Order> findOrders(Long userId, String status) {
        if(status == null|| status.equals("")){
            return orderRepository.findAllByUserIdOrderByOrderDateAsc(userId);
        } else{
            return orderRepository.findAllByUserIdAndStatusOrderByOrderDateAsc(userId, status);
        }

    }
}
