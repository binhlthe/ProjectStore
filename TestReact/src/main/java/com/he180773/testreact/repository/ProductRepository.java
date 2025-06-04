package com.he180773.testreact.repository;

import com.he180773.testreact.entity.Product;
import jdk.jfr.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByCategory(String category);
    Page<Product> findAllByCategory(String category, Pageable pageable);

    List<Product> findAllByOrderByArrivedDateDesc();

    @Query("SELECT p FROM Product p WHERE " +
            "p.arrivedDate >= :startDate AND" +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)" )
    Page<Product> findNewArrivalsSorted(@Param("startDate") LocalDateTime startDate,
                                        @Param("name") String name,
                                        @Param("minPrice") Integer minPrice,
                                        @Param("maxPrice") Integer maxPrice,Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.arrivedDate >= :startDate")
    List<Product> findNewArrivals(@Param("startDate") LocalDateTime startDate);

    // Tìm theo tên chứa và lọc theo khoảng giá (min-max)
    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND" +
            "(p.category LIKE :category)")
    Page<Product> findFilteredProducts(
            @Param("category" ) String category,
            @Param("name") String name,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            Pageable pageable
    );


}
