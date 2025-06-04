package com.he180773.testreact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.he180773.testreact.repository")
public class TestReactApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestReactApplication.class, args);
    }
}
