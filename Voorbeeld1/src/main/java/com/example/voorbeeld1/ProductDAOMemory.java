package com.example.voorbeeld1;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.*;

@Profile("prod")
@Service
public class ProductDAOMemory implements ProductDAO {

    private final Map<Long, Product> products = new HashMap<>();
    private static Long counter = 2L;

    public ProductDAOMemory(){
        Product product = new Product(1L, "Pasta", "Dit is volkoren pasta", 50, 12.99);
        this.products.put(product.getId(), product);
    }

    public List<Product> findAll() {
        return new ArrayList<>(products.values());
    }

    public Optional<Product> findById(long id) {
        return Optional.ofNullable(products.get(id));
    }

    public void addProduct(final Product product) {
        product.setId(counter);
        counter++;
        products.putIfAbsent(product.getId(), product);
    }

    public void deleteProduct(Long id) {
        products.remove(id);
    }

    public void updateProduct(Long id, Product product) {
        products.put(id, product);
    }

    public boolean existsProduct(Long id) {
        return  products.containsKey(id);
    }
}
