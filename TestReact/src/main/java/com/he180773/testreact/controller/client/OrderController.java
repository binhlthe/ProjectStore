package com.he180773.testreact.controller.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.he180773.testreact.dto.*;
import com.he180773.testreact.entity.*;
import com.he180773.testreact.repository.*;
import com.he180773.testreact.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductVariantController productVariantController;
    private final OrderService orderService;
    private final ProductRepository productRepository;


    public OrderController(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                           CartRepository cartRepository, CartItemRepository cartItemRepository,
                           ProductVariantRepository productVariantRepository, ProductVariantController productVariantController,
                           OrderService orderService, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.productVariantController = productVariantController;
        this.orderService = orderService;
        this.productRepository = productRepository;
    }

    @Transactional
    @PostMapping("/handle")
    public ResponseEntity<?> handleOrder(@RequestBody OrderRequest orderRequest) {

        Order order = new Order();
        order.setUserId(orderRequest.getUserId());
        order.setPaymentMethod(orderRequest.getPaymentMethod());

        AddressDTO addressDTO = orderRequest.getAddress();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String addressJson = objectMapper.writeValueAsString(addressDTO);
            order.setUserAddress(addressJson);
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // hoặc log lỗi lại
            throw new RuntimeException("Lỗi khi convert addressDTO sang JSON", e);
        }
        order.setOrderDate(orderRequest.getOrderDate());
        order.setStatus("PENDING");
        order.setTotalPrice(orderRequest.getTotalPrice());
        orderRepository.save(order);

        Optional<Cart> cart = cartRepository.findByUserId(orderRequest.getUserId());



        List<OrderItemDTO> orderItems = orderRequest.getItems();

        for (OrderItemDTO orderItemDTO : orderItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setQuantity(orderItemDTO.getQuantity());
            orderItem.setProductVariantId(orderItemDTO.getProductVariantId());
            orderItem.setPrice(orderItemDTO.getPrice());
            orderItemRepository.save(orderItem);

            cartItemRepository.deleteByCartIdAndProductVariantId(cart.get().getId(), orderItemDTO.getProductVariantId());
        }

        return ResponseEntity.ok(order);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getOrder(@CookieValue(value = "token", required = false) String token,
                                      @RequestParam Long userId,
                                      @RequestParam String status) {
        System.out.println("id: "+userId);
        System.out.println("status: "+status);
        List<Order> order= orderService.findOrders(userId, status);
        List<AdminOrderResponseDTO> adminDTO = new ArrayList<>();
        for(Order orderItem : order) {
            AdminOrderResponseDTO adminOrderResponseDTO = new AdminOrderResponseDTO();
            adminOrderResponseDTO.setId(orderItem.getId());
            adminOrderResponseDTO.setStatus(orderItem.getStatus());
            adminOrderResponseDTO.setOrderDate(orderItem.getOrderDate());
            adminOrderResponseDTO.setPaymentMethod(orderItem.getPaymentMethod());
            adminOrderResponseDTO.setUserAddress(orderItem.getUserAddress());
            adminOrderResponseDTO.setTotalAmount(orderItem.getTotalPrice());

            List<OrderItemDetailDTO> orderItemDetailDTO = new ArrayList<>();

            List<OrderItem> orderItems = new ArrayList<>();
            orderItems= orderItemRepository.findByOrderId(orderItem.getId());

            List<ProductVariant> variants = new ArrayList<>();
            for(OrderItem orderItem1 : orderItems) {
                ProductVariant variant = productVariantRepository.findById(orderItem1.getProductVariantId()).get();
                variant.setQuantity(orderItem1.getQuantity());
                variants.add(variant);

            }

            for(ProductVariant productVariant : variants) {
                System.out.println("id Variant: "+productVariant.getId());
                OrderItemDetailDTO orderItemDetailDTO1 = new OrderItemDetailDTO();
                orderItemDetailDTO1.setColor(productVariant.getColor());
                orderItemDetailDTO1.setQuantity(productVariant.getQuantity());
                orderItemDetailDTO1.setSize(productVariant.getSize());
                orderItemDetailDTO1.setImage(productVariant.getImage());
                Optional<Product> product =  productRepository.findById(productVariant.getProductId());
                orderItemDetailDTO1.setProductName(product.get().getName());
                orderItemDetailDTO1.setProductPrice(product.get().getPrice());
                orderItemDetailDTO.add(orderItemDetailDTO1);
            }
            System.out.println("size: "+orderItemDetailDTO.size());
            adminOrderResponseDTO.setItems(orderItemDetailDTO);
            adminDTO.add(adminOrderResponseDTO);

        }

        return ResponseEntity.ok(adminDTO);
        }


}
