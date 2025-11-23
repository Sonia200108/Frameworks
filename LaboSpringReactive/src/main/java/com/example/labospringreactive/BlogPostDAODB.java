package com.example.labospringreactive;

import org.springframework.data.mongodb.core.ChangeStreamEvent;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BlogPostDAODB implements BlogPostDAO {

    private final BlogPostRepository repository;
    private final ReactiveMongoTemplate template;
    public BlogPostDAODB(BlogPostRepository repository, ReactiveMongoTemplate template) {
        this.repository = repository;
        this.template = template;
    }

    public Flux<BlogPost> getAllPosts() {
        return repository.findAll();
    }

    public Mono<BlogPost> addPost(BlogPost blogPost){
        return repository.save(blogPost);
    }
    public Mono<BlogPost> updatePost(String id,  BlogPost blogPost){
        return repository.save(blogPost);
    }
    public Mono<BlogPost> getPost(String id){
        return repository.findById(id);
    }
    public Mono<Void> deletePost(String id){
        return repository.deleteById(id);
    }
    public Flux<BlogPost> findByTitleContaining(String keyword){
        return repository.findByTitleContaining(keyword);
    }
    public Flux<BlogPost> getChangeStreamPosts(){
        return template
                .changeStream(BlogPost.class)
                .watchCollection("posts")
                .filter(Criteria.where("operationType").in("insert","replace","update"))
                .listen()
                .mapNotNull(ChangeStreamEvent::getBody);
    }
}
