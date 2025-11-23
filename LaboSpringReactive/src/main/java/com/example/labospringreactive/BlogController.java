package com.example.labospringreactive;


import io.micrometer.core.instrument.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.*;
import reactor.core.publisher.*;

import java.time.Duration;


@RestController
public class BlogController {

    private final Logger logger = LoggerFactory.getLogger(BlogController.class);

    private final BlogPostDAO postDAO;

    private final Counter postsCreateCounter;
    private final Counter postsDeleteCounter;
    private final Counter postsReadCounter;
    private final Counter postsUpdateCounter;



    public BlogController(BlogPostDAO dao, MeterRegistry meterRegistry){
        this.postDAO = dao;
        this.postsCreateCounter = meterRegistry.counter("blogpost_total", "operation", "created");
        this.postsDeleteCounter = meterRegistry.counter("blogpost_total", "operation", "deleted");;
        this.postsReadCounter = meterRegistry.counter("blogpost_total", "operation", "read");;
        this.postsUpdateCounter = meterRegistry.counter("blogpost_total", "operation", "updated");;
    }

    @GetMapping("/posts")
    public Flux<BlogPost> getPosts() {
        this.postsReadCounter.increment();
        return postDAO.getAllPosts();
    }

    @GetMapping("/posts/{id}")
    public Mono<BlogPost> getPost(@PathVariable("id") String id) {
        this.postsReadCounter.increment();
        return postDAO.getPost(id).switchIfEmpty(Mono.error(new PostNotFoundException(id)));
    }

    @PostMapping("/posts")
    public Mono<ResponseEntity<Void>> addPost(@RequestBody BlogPost post, UriComponentsBuilder uriBuilder) {
        this.postsCreateCounter.increment();
        return postDAO.addPost(post)
                .map(savedPost -> ResponseEntity.created(
                                uriBuilder
                                        .path("/posts/{id}")
                                        .buildAndExpand(savedPost.getId())
                                        .toUri())
                        .build());
    }

    @DeleteMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deletePost(@PathVariable("id") String id) {
        this.postsDeleteCounter.increment();
        return postDAO.deletePost(id);
    }

    @PutMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<BlogPost> updatePost(@RequestBody BlogPost post, @PathVariable("id") String id) {
        if (!id.equals(post.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ID in path does not match ID in the body");
        }
        this.postsUpdateCounter.increment();
        return postDAO.updatePost(id, post);
    }

    @GetMapping("/posts/search")
    public Flux<BlogPost> searchPosts(@RequestParam(name = "q") String keyword) {
        return postDAO.findByTitleContaining(keyword);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(PostNotFoundException.class)
    public void handleNotFound(Exception ex) {
        logger.warn("Exception is: " + ex.getMessage());
        // return empty 404
    }

    // Streaming REST API met 1 seconden delay tussen elk

    @GetMapping("/stream/posts-delay")
    public Flux<BlogPost> getPostsStreamV1() {
        this.postsReadCounter.increment();
        return postDAO.getAllPosts().delayElements(Duration.ofSeconds(1)).log();
    }

    @GetMapping(value = "/stream/posts-text", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<BlogPost> getPostsStreamV2() {
        this.postsReadCounter.increment();
        return postDAO.getAllPosts().delayElements(Duration.ofSeconds(1)).log();
    }

    @GetMapping(value = "/stream/posts-json", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<BlogPost> getPostsStreamV3() {
        this.postsReadCounter.increment();
        return postDAO.getAllPosts().delayElements(Duration.ofSeconds(1)).log();
    }

    @GetMapping(value = "/stream/posts", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<BlogPost> getChangeStreamPosts() {
        this.postsReadCounter.increment();
        return postDAO.getChangeStreamPosts().log();
    }

}
