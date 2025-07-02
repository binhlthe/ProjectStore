package com.he180773.testreact.controller;


import com.he180773.testreact.dto.UserDTO;
import com.he180773.testreact.entity.Wallet;
import com.he180773.testreact.repository.WalletRepository;
import com.he180773.testreact.request.AccountRequest;
import com.he180773.testreact.entity.User;
import com.he180773.testreact.jwt.JwtUtils;
import com.he180773.testreact.repository.UserRepository;
import com.he180773.testreact.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;

    public AuthController(UserRepository userRepository, AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils, UserService userService,BCryptPasswordEncoder passwordEncoder,
                          WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.walletRepository = walletRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AccountRequest request, HttpServletResponse response) {
        try {


            String username = request.getUsername();
            String password = request.getPassword();
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            User user = userRepository.findByUsername(username);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtUtils.generateToken(username, user.getRole());
            // ✅ Lưu token vào Cookie

            response.setHeader("Set-Cookie",
                    "token=" + token + "; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax");

            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setUsername(username);
            userDTO.setAvatar(user.getAvatar());
            userDTO.setName(user.getName());
            userDTO.setPhone(user.getPhone());
            userDTO.setRole(user.getRole());
            userDTO.setDob(user.getDob());
            userDTO.setGender(user.isGender());
            userDTO.setEmail(user.getEmail());
            userDTO.setStatus(user.isStatus());
            userDTO.setCreatedAt(user.getCreatedAt());
            return ResponseEntity.ok(userDTO);
        }
        catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu!");
        }
    }


    @PostMapping("/user/profile")
    public ResponseEntity<?> getUserProfile(@CookieValue(value = "token", required = false) String token,
                                               Model model) {
        User user = userService.getAccountFromToken(token);
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setName(user.getName());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole());
            return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AccountRequest request, HttpServletResponse response) {
        try {
            String name = request.getName();
            String username = request.getUsername();
            String password = request.getPassword();
            String confirmPassword = request.getConfirmPassword();

            if(userRepository.findByUsername(username) != null) {
                return ResponseEntity.status(409).body("Tài khoản đã tồn tại!");
            }

            User user = new User();
            user.setName(name);
            user.setUsername(username);
            if (!password.startsWith("$2a$")) { // ✅ Chỉ mã hóa nếu chưa mã hóa
                user.setPassword(passwordEncoder.encode(password));
            }
            userService.save(user);
            Wallet  wallet = new Wallet();
            wallet.setUserId(user.getId());
            wallet.setBalance(0);
            wallet.setStatus("ON");
            wallet.setLastUpdated(LocalDateTime.now());
            walletRepository.save(wallet);
            return ResponseEntity.ok("Đăng kí thành công!");
        }
        catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu!");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie jwtCookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)  // Xóa token
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully!");
    }


}

