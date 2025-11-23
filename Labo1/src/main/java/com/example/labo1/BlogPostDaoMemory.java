package com.example.labo1;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Profile("test")
@Service
public class BlogPostDaoMemory implements BlogPostDao {

    private final Map<Long,BlogPost> blogPosts = new HashMap<>();
    private static Long counter = 2L;

    public BlogPostDaoMemory() {
        BlogPost helloWorldPost = new BlogPost(1L,"Hello World", "This is my first post!");
        // Add dummy blog post to the collection
        this.blogPosts.put(helloWorldPost.getId(), helloWorldPost);
    }

    public List<BlogPost> getAllPosts() {
        return new ArrayList<>(blogPosts.values());
    }

    public void addPost(final BlogPost blogPost) {
        blogPost.setId(counter);
        counter++;
        blogPosts.putIfAbsent(blogPost.getId(), blogPost);
    }

    public void updatePost(final Long id, final BlogPost blogPost) {
        blogPosts.put(id, blogPost);
    }


    public Optional<BlogPost> getPost(final Long id) {
        return Optional.ofNullable(blogPosts.get(id));
    }

    public void deletePost(final Long id) {
        blogPosts.remove(id);
    }

    public boolean exists(Long id){
        return blogPosts.containsKey(id);
    }

    @Override
    public List<BlogPost> searchPostsByTitleContaining(String keyword) {
        return blogPosts.values().stream().filter(post -> post.getTitle().contains(keyword)).collect(Collectors.toList());
    }
}
