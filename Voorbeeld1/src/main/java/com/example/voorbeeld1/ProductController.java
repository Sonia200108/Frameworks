package com.example.voorbeeld1;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.server.servlet.context.ServletComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductDAO productDAO;

    private final Counter postCounter;
    private final Counter getCounter;
    private final Counter putCounter;
    private final Counter deleteCounter;

    public ProductController(ProductDAO productDAO, MeterRegistry meterRegistry) {
        this.productDAO = productDAO;

        postCounter = Counter.builder("product_count").description("product create count").tag("operation","created").register(meterRegistry);
        getCounter = Counter.builder("product_count").description("product get count").tag("operation","get").register(meterRegistry);
        putCounter = Counter.builder("product_count").description("product put count").tag("operation","put").register(meterRegistry);
        deleteCounter = Counter.builder("product_count").description("product delete count").tag("operation","delete").register(meterRegistry);
    }

    @GetMapping
    public List<Product> getProducts() {
        getCounter.increment();
        return productDAO.findAll();
    }

    @GetMapping("{id}")
    public Product  getProduct(@PathVariable("id") Long id) {
        getCounter.increment();
        return productDAO.findById(id).orElseThrow(()-> new ProductNotFoundException(id));
    }

    @Secured({"ROLE_ADMIN"})
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        productDAO.addProduct(product);
        postCounter.increment();
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(product.getId()).toUri();
        return ResponseEntity.created(uri).body(product);
    }

    @Secured({"ROLE_ADMIN"})
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable("id") Long id) {
        if(productDAO.existsProduct(id)){
            deleteCounter.increment();
            productDAO.deleteProduct(id);
        }else{
            throw new ProductNotFoundException(id);
        }
    }

    @Secured({"ROLE_ADMIN"})
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProduct(@PathVariable("id") Long id, @RequestBody Product product) {
        if(productDAO.existsProduct(id)){
            if (!id.equals(product.getId())) {
                productDAO.updateProduct(id,product);
                putCounter.increment();
            }else{
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Id path and post not correct");
            }

        }else{
            throw new ProductNotFoundException(id);
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ProductNotFoundException.class)
    public void handleNotFound(Exception ex) {
        //logger warning with 404 not found and time stamp
        logger.warn(ex.getMessage() + " at " + new Date());
    }

}
