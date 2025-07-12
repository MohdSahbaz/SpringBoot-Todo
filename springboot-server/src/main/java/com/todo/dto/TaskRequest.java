package com.todo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank(message = "Task required!")
    private  String task;
    private String description;
    @NotBlank(message = "Priority required!")
    private String priority;
}
