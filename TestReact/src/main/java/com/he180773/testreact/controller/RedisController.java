package com.he180773.testreact.controller;

import com.he180773.testreact.service.RedisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/redis")
public class RedisController {

    private final RedisService redisService;

    public RedisController(RedisService redisService) {
        this.redisService = redisService;
    }

    @GetMapping("/set")
    public String set(@RequestParam String key, @RequestParam String value) {
        redisService.save(key, value);
        return "Saved!";
    }



    @GetMapping("/get")
    public String get(@RequestParam String key) {
        String value = redisService.get(key);
        return value != null ? value : "Not found";
    }
}

