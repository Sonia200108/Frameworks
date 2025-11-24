package com.example.voorbeeld1;

import java.util.List;
import java.util.Optional;

public interface ProductDAO {

    List<Product> findAll();
    Optional<Product> findById(long id);

    void addProduct(Product product);
    void deleteProduct(Long id);

    void updateProduct(Long id, Product product);

    boolean existsProduct(Long id);
}
