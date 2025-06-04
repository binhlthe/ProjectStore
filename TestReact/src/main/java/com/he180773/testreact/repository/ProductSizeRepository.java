package com.he180773.testreact.repository;


import com.he180773.testreact.entity.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize,Long> {
    @Query("SELECT ps.sid FROM ProductSize ps WHERE ps.pid = :pid")
    List<Long> findSidByPid(@Param("pid") Long pid);

}
