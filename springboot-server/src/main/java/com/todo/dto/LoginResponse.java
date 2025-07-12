package com.todo.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String id;
    private String username;
    private String message;

    public LoginResponse(String id, String username, String message) {
        this.id = id;
        this.username = username;
        this.message = message;
    }

}
