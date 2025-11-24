package com.example.voorbeeld1;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.AntPathMatcher;

import javax.sql.DataSource;

import static org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType.H2;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    @Value("admin")
    String adminUsername;
    @Value("adminpass")
    String adminPassword;
    @Value("ADMIN")
    String adminRoles;

    @Autowired
    Environment env;

    @Bean
    DataSource dataSource() {
        return new EmbeddedDatabaseBuilder().setType(H2).addScript(JdbcDaoImpl.DEFAULT_USER_SCHEMA_DDL_LOCATION).build();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder, DataSource dataSource) {
        LoggerFactory.getLogger(SecurityConfig.class.getName()).info("Encoded password: " + passwordEncoder.encode(adminPassword));
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.createUser(User.withUsername(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .roles(adminRoles)
                .build());
        return manager;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(requests ->
                        requests.requestMatchers("/Admin.html").hasRole("ADMIN")
                                .anyRequest().permitAll())
                .httpBasic(Customizer.withDefaults())
                .csrf((csrf)-> csrf
                        .ignoringRequestMatchers("/h2-console/*")
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                .headers(h-> h.frameOptions(frameOptionsConfig -> frameOptionsConfig.sameOrigin()));
        if(env.getActiveProfiles().length > 0 && env.getActiveProfiles()[0].trim().equalsIgnoreCase("Test")){
            http.csrf(csrf -> csrf.disable());
        }

        return http.build();
    }

}
