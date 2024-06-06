package com.example.karsun.taskmanager.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.example.karsun.taskmanager.entity.Task;
import com.example.karsun.taskmanager.repository.TaskRepository;

@SpringBootTest
public class TaskServiceTest {
    @Autowired
    private TaskService taskService;

    @MockBean
    private TaskRepository taskRepository;

    @Test
    public void testCreateTask() {
        Task task = new Task(null, "Test Task", "Test Description", "OPEN", LocalDate.now(), "HIGH");
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task createdTask = taskService.createTask(task);

        assertNotNull(createdTask);
        assertEquals("Test Task", createdTask.getTitle());

        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    public void testGetTaskById() {
        Task task = new Task(1L, "Test Task", "Test Description", "OPEN", LocalDate.now(), "HIGH");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Task foundTask = taskService.getTaskById(1L).get();

        assertNotNull(foundTask);
        assertEquals("Test Task", foundTask.getTitle());

        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    public void testFailGetTaskById(){
        when(taskRepository.findById(anyLong())).thenReturn(Optional.empty());

        Optional<Task> foundTask = taskService.getTaskById(1L);
        assertEquals(Optional.empty(), foundTask);

        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetAllTasks() {
        Task task1 = new Task(1L, "Test Task 1", "Test Description 1", "OPEN", LocalDate.now(), "HIGH");
        Task task2 = new Task(2L, "Test Task 2", "Test Description 2", "OPEN", LocalDate.now(), "HIGH");
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);
        when(taskRepository.findAll()).thenReturn(tasks);

        List<Task> foundTasks = taskService.getAllTasks();

        assertNotNull(foundTasks);
        assertEquals(2, foundTasks.size());

        verify(taskRepository, times(1)).findAll();
    }

    @Test
    public void testEmptyGetAllTasks(){
        when(taskRepository.findAll()).thenReturn(Collections.emptyList());

        List<Task> foundTasks = taskService.getAllTasks();
        assertEquals(Collections.emptyList(), foundTasks);

        verify(taskRepository, times(1)).findAll();
    }

    @Test
    public void testUpdateTask() {
        Task task = new Task(1L, "Test Task", "Test Description", "OPEN", LocalDate.now(), "HIGH");
        Task updatedTask = new Task(1L, "Updated Task", "Updated Description", "IN_PROGRESS", LocalDate.now(), "MEDIUM");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        Task existingTask = taskService.getTaskById(1L).get();
        existingTask.setTitle("Updated Task");
        existingTask.setDescription("Updated Description");
        existingTask.setStatus("IN_PROGRESS");
        existingTask.setPriority("MEDIUM");
        Task savedTask = taskService.updateTask(1L, existingTask);

        assertNotNull(savedTask);
        assertEquals("Updated Task", savedTask.getTitle());
        assertEquals("Updated Description", savedTask.getDescription());
        assertEquals("IN_PROGRESS", savedTask.getStatus());
        assertEquals("MEDIUM", savedTask.getPriority());

        verify(taskRepository, times(2)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    public void testFailUpdateTask(){
        when(taskRepository.findById(anyLong())).thenReturn(Optional.empty());

        Task savedTask = taskService.updateTask(1L, new Task(1L, "Updated Task", "Updated Description", "IN_PROGRESS", LocalDate.now(), "MEDIUM"));

        assertEquals(null, savedTask);;

        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    public void testDeleteTask() {
        Task task = new Task(1L, "Test Task", "Test Description", "OPEN", LocalDate.now(), "HIGH");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testFailDeleteTask(){
        when(taskRepository.findById(anyLong())).thenReturn(Optional.empty());

        taskService.deleteTask(1L);

        assertThrows(NoSuchElementException.class, () -> {
            taskService.getTaskById(1L).get();
        });

        verify(taskRepository, times(1)).deleteById(1L);
    }
}
