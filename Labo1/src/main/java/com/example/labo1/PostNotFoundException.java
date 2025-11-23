package com.example.labo1;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(Long id) {
        super("Post with id " + id + " not found");
    }
}
