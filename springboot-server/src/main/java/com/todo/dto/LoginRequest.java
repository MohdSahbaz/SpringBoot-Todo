package com.todo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
public class LoginRequest {

    @NotBlank(message = "Username required!")
    private String username;

    @NotBlank(message = "Password required!")
    private String password;
}
