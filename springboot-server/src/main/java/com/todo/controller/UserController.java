package com.todo.controller;

import com.todo.dto.LoginRequest;
import com.todo.dto.LoginResponse;
import com.todo.model.User;
import com.todo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = {"*"})
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            Optional<User> existingUser = userService.findUserByUsername(user.getUsername());
            if (existingUser.isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Username already taken");
            }

            User saved = userService.createdUser(user);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(saved);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("DUE TO INTERNAL SERVER ERROR, REGISTRATION FAILED");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User existingUser = userService.findUserByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            boolean isPasswordMatch = passwordEncoder.matches(loginRequest.getPassword(), existingUser.getPassword());

            if (!isPasswordMatch) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Credential error");
            }

            LoginResponse loginResponse = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(loginResponse);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("DUE TO INTERNAL SERVER ERROR, LOGIN FAILED");
        }
    }
}
