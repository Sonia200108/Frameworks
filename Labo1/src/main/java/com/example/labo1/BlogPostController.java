package com.example.labo1;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.net.URI;
import java.util.List;
import java.util.logging.Logger;
import io.micrometer.core.instrument.Counter;

@RestController
@RequestMapping("/posts")
public class BlogPostController {

    /*private final Logger logger = LoggerFactory.getLogger(BlogPostController.class);*/
    private final BlogPostDaoMemory dao;

    private final Counter postCounter;
    private final Counter getCounter;
    private final Counter putCounter;
    private final Counter deleteCounter;

    public BlogPostController(MeterRegistry registry, BlogPostDaoMemory dao) {
        this.dao = dao;

        postCounter = Counter.builder("blogpost_count").description("post create count").tag("operation","created").register(registry);
        getCounter = Counter.builder("blogpost_count").description("post get count").tag("operation","get").register(registry);
        putCounter = Counter.builder("blogpost_count").description("post put count").tag("operation","put").register(registry);
        deleteCounter = Counter.builder("blogpost_count").description("post delete count").tag("operation","delete").register(registry);
    }

    @GetMapping
    public List<BlogPost> getAll() {
        getCounter.increment();
        return dao.getAllPosts();
    }

    @GetMapping("/search")
    public List<BlogPost> getPosts(@RequestParam(name = "q") String search) {
        return dao.searchPostsByTitleContaining(search);
    }


    @GetMapping("{id}")
    public BlogPost getById(@PathVariable("id") Long id) {
        getCounter.increment();
        return dao.getPost(id).orElseThrow(() -> new PostNotFoundException(id));
    }

    @Secured({"ROLE_ADMIN"})
    @PostMapping
    public ResponseEntity<BlogPost> create(@RequestBody BlogPost post) {
        dao.addPost(post);
        postCounter.increment();
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(post.getId()).toUri();
        return ResponseEntity.created(uri).body(post);
    }

    @Secured({"ROLE_ADMIN"})
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        if(dao.exists(id)){
            deleteCounter.increment();
            dao.deletePost(id);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post Not Found");
        }
    }

    @Secured({"ROLE_ADMIN"})
    @PutMapping("{id}")
    public ResponseEntity<String> update(@RequestBody BlogPost post, @PathVariable("id") long id) {

        if(dao.exists(id)){
            if(id == post.getId()){
                dao.updatePost(id,post);
                putCounter.increment();
                return new ResponseEntity<>("", HttpStatus.NO_CONTENT);
            }else{
                return new ResponseEntity<>("Id path and post incorrect", HttpStatus.CONFLICT);
            }
        }else{
            return new ResponseEntity<>("Post doesn't exist", HttpStatus.NOT_FOUND);
        }
    }

    //Alternative
    /*@PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updatePost(@RequestBody BlogPost post, @PathVariable("id") long id) {
        if (postsDao.exists(id)) {
            if (id == post.getId()) {
                postsDao.updatePost(id, post);
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "ID path and post inconsistent");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post doesn't exist");
        }
    }*/

    /**
     * Explicit exception handler to map PostNotFoundException to a 404 Not Found HTTP status code.
     * Alternative to annotating the exception class PostNotFoundException
     */
    /*@ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(PostNotFoundException.class)
    public void handleNotFound(Exception ex) {
        logger.warn("Exception is: " + ex.getMessage());
        // return empty 404
    }*/
}
