package com.example.labo1;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Profile("!test")
@Service
public class BlogPostDaoDB implements BlogPostDao{

    private final  BlogPostRepository blogPostRepository;

    public BlogPostDaoDB(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    @Override
    public List<BlogPost> getAllPosts(){
        return blogPostRepository.findAll();
    }

    @Override
    public Optional<BlogPost> getPost(Long id){
        return blogPostRepository.findById(id);
    }

    @Override
    public void addPost(BlogPost blogPost) {
        blogPostRepository.save(blogPost);
    }

    @Override
    public boolean exists(Long id) {
        return blogPostRepository.existsById(id);
    }

    @Override
    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    @Override
    public void updatePost(Long id, BlogPost blogPost) {
        blogPostRepository.save(blogPost);
    }

    @Override
    public List<BlogPost> searchPostsByTitleContaining(String keyword) {
        return blogPostRepository.findByTitleContaining(keyword);
    }
}
