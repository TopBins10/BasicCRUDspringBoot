package com.example.karsun.taskmanager.controller;

import java.time.LocalDate;

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
import static org.mockito.ArgumentMatchers.any;
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

    @BeforeEach
    void setUp() {
        task = new Task(1L, "Test Task", "Test Description", "OPEN", LocalDate.now(), "HIGH");
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
    public void getTaskById() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.of(task));

        mockMvc.perform(get("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.is(1)))
                .andExpect(jsonPath("$.title", Matchers.is("Test Task")));
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
    public void deleteTask() throws Exception {
        doNothing().when(taskService).deleteTask(1L);
        when(taskService.getTaskById(1L)).thenReturn(java.util.Optional.of(task));

        mockMvc.perform(delete("/tasks/1"))
                .andExpect(status().isNoContent());
        verify(taskService, times(1)).deleteTask(1L);
    }

}
