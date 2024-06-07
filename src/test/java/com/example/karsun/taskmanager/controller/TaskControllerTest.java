package com.example.karsun.taskmanager.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import com.example.karsun.taskmanager.entity.Task;
import com.example.karsun.taskmanager.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    private Task task;
    private Task task2;
    private Task taskDupe;

    @BeforeEach
    void setUp() {
        task = new Task(1L, "Test Task", "Test Description", "OPEN", LocalDate.now(), "HIGH");
        taskDupe = new Task(1L, "Test Task Duplicate", "Duplicate description", "OPEN", LocalDate.now(), "HIGH");
        task2 = new Task(2L, "Test Task 2", "Test Description 2", "OPEN", LocalDate.now(), "LOW");
    }

    @Test
    public void createTask() throws Exception {
        when(taskService.createTask(any(Task.class))).thenReturn(task);

        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.is(1)))
                .andExpect(jsonPath("$.title", Matchers.is("Test Task")));
    }

    @Test
    public void createTaskFailNull() throws Exception {
        when(taskService.createTask(any(Task.class))).thenReturn(null);

        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void createTaskFailNullDupe() throws Exception {
            // Arrange
        // First task creation should succeed
        when(taskService.createTask(any(Task.class))).thenAnswer(invocation -> {
            Task argTask = invocation.getArgument(0);
            if (argTask.getTitle().equals("Test Task")) {
                return task;
            } else {
                return taskDupe;
            }
        });

        // First request to getTaskById should return empty
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        // First request should succeed
        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.is(1)))
                .andExpect(jsonPath("$.title", Matchers.is("Test Task")));

        // Simulate the task now existing in the database
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.of(task));

        // Second request should fail with conflict status
        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskDupe)))
                .andExpect(status().isConflict());
        }

    @Test
    public void getTaskById() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.of(task));

        mockMvc.perform(get("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.is(1)))
                .andExpect(jsonPath("$.title", Matchers.is("Test Task")));
    }

    @Test
    public void getTaskByIdFail() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/tasks/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void getAllTasks() throws Exception {
        when(taskService.getAllTasks()).thenReturn(java.util.List.of(task, task2));

        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", Matchers.is(1)))
                .andExpect(jsonPath("$[1].id", Matchers.is(2)))
                .andExpect(jsonPath("$[0].title", Matchers.is("Test Task")));
    }

    @Test
    public void getAllTasksEmpty() throws Exception {
        when(taskService.getAllTasks()).thenReturn(java.util.List.of());

        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    public void updateTask() throws Exception {
        when(taskService.updateTask(anyLong(), any(Task.class))).thenReturn(task2);
        mockMvc.perform(put("/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.is(2)))
                .andExpect(jsonPath("$.title", Matchers.is("Test Task 2")));
    }

    @Test
    public void updateTaskFailTest() throws Exception {
        when(taskService.updateTask(anyLong(), any(Task.class))).thenReturn(null);

        mockMvc.perform(put("/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task2)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void deleteTask() throws Exception {
        doNothing().when(taskService).deleteTask(1L);
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.of(task));

        mockMvc.perform(delete("/tasks/1"))
                .andExpect(status().isNoContent());
        verify(taskService, times(1)).deleteTask(1L);
    }

    @Test
    public void deleteTaskFail() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.empty());
        doThrow(new NoSuchElementException()).when(taskService).deleteTask(1L);
    
        assertThrows(NoSuchElementException.class, () -> {
            taskService.getTaskById(1L).get();
        });
    
        mockMvc.perform(delete("/tasks/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCRUDOperations() throws Exception {
        // Create tasks
        for (int i = 1; i <= 10; i++) {
            Task task = new Task((long) i, "Test Task " + i, "Test Description " + i, "OPEN", LocalDate.now(), "HIGH");
            when(taskService.createTask(any(Task.class))).thenReturn(task);

            mockMvc.perform(post("/tasks")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(task)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", Matchers.is(i)))
                    .andExpect(jsonPath("$.title", Matchers.is("Test Task " + i)));
        }

        // Delete tasks
        for (int i = 1; i <= 5; i++) {
            doNothing().when(taskService).deleteTask((long) i);
            when(taskService.getTaskById((long) i)).thenReturn(java.util.Optional.of(new Task((long) i, "Test Task " + i, "Test Description " + i, "OPEN", LocalDate.now(), "HIGH")));

            mockMvc.perform(delete("/tasks/" + i))
                    .andExpect(status().isNoContent());
            verify(taskService, times(1)).deleteTask((long) i);
        }

        // Check remaining tasks
        List<Task> remainingTasks = new ArrayList<>();
        for (int i = 6; i <= 10; i++) {
            remainingTasks.add(new Task((long) i, "Test Task " + i, "Test Description " + i, "OPEN", LocalDate.now(), "HIGH"));
        }
        when(taskService.getAllTasks()).thenReturn(remainingTasks);

        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(5)));
    }
}
