package com.todo.controller;

import com.todo.dto.TaskRequest;
import com.todo.model.Task;
import com.todo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/user-tasks")
    public ResponseEntity<?> getUserTasks(@RequestHeader("userId") String userId) {
        try {
            // Validate input
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("User ID is required.");
            }

            List<Task> tasks = taskService.getUserTasks(userId);

            if (tasks.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content
            }

            return ResponseEntity.ok(tasks); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong while fetching tasks.");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTask(@RequestBody @Valid TaskRequest request, @RequestHeader("userId") String userId) {
        try {
            Task savedTask = taskService.createTaskForUser(userId, request);
            return ResponseEntity.ok(savedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUserTask(@RequestParam String taskId) {
        try {
            boolean isDeleted = taskService.deleteUserTask(taskId);
            if (isDeleted) {
                return ResponseEntity.ok("Task deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found!");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserTask(@RequestParam String taskId, @RequestBody TaskRequest taskRequest) {
        try {
            Task updated = taskService.updateUserTask(taskId, taskRequest);

            if (updated != null) {
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

}
