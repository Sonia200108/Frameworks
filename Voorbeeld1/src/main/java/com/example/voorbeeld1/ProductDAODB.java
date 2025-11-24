package com.example.voorbeeld1;


import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Profile("!prod")
@Service
public class ProductDAODB implements ProductDAO {

    private final ProductRepository repository;

    public ProductDAODB(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Product> findById(long id) {
        return repository.findById(id);
    }

    @Override
    public void addProduct(Product product) {
        repository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    @Override
    public void updateProduct(Long id, Product product) {
        repository.save(product);
    }

    @Override
    public boolean existsProduct(Long id) {
        return  repository.existsById(id);
    }
}
