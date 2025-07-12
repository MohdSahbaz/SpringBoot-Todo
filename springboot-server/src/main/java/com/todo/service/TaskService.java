package com.todo.service;

import com.todo.dto.TaskRequest;
import com.todo.model.Task;
import com.todo.model.User;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Get user task
    public List<Task> getUserTasks(String userId) {
        return taskRepository.findAllByUser_Id(userId);
    }

    public Task createTaskForUser(String userId, TaskRequest taskRequest) {
        // Find user
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        // Create task
        Task task = new Task();
        task.setTask(taskRequest.getTask());
        task.setDescription(taskRequest.getDescription());
        task.setPriority(taskRequest.getPriority());
        task.setUser(user);
        return taskRepository.save(task);
    }

    public boolean deleteUserTask(String taskId) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            taskRepository.deleteById(taskId);
            return true;
        } else {
            return false;
        }
    }

    public Task updateUserTask(String taskId, TaskRequest taskRequest) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            Task existingTask = task.get();
            existingTask.setTask(taskRequest.getTask() != null ? taskRequest.getTask() : existingTask.getTask());
            existingTask.setDescription(taskRequest.getDescription() != null ? taskRequest.getDescription() : existingTask.getDescription());
            existingTask.setPriority(taskRequest.getPriority() != null ? taskRequest.getPriority() : existingTask.getPriority());
            taskRepository.save(existingTask);
            return existingTask;
        } else {
            return null;
        }
    }
}
