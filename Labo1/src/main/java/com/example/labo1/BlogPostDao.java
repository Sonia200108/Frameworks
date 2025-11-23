package com.example.labo1;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface BlogPostDao {

    List<BlogPost> getAllPosts();

    Optional<BlogPost> getPost(Long id);

    void addPost(BlogPost blogPost);

    boolean exists(Long id);
    void deletePost(Long id);

    void updatePost(Long id, BlogPost blogPost);

    List<BlogPost> searchPostsByTitleContaining(String keyword);
}
