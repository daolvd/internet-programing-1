package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.LoginRequest;
import com.flashcard.backend.dto.response.LoginResponse;
import com.flashcard.backend.dto.response.RegisterResponse;
import com.flashcard.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController{
    final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login (@RequestBody @Valid LoginRequest loginRequest){
        LoginResponse loginResponse = userService.loginByClientSeed(loginRequest.getClientSeed());
        return  ResponseEntity.ok(new ApiResponse<>(true,"login success",loginResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody @Valid LoginRequest registerRequest){
        RegisterResponse registerResponse = userService.registerUser(registerRequest.getClientSeed());
        return ResponseEntity.ok(new ApiResponse<>(true,"register success",registerResponse));
    }
}
