package com.example.labo1;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByTitleContaining(String keyword);
}
