package be.iii.jdbclabo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;

@SpringBootApplication
public class JdbcLaboApplication {

    public static void main(String[] args) {
        SpringApplication.run(JdbcLaboApplication.class, args);
    }

}
