package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.common.AuthCookieService;
import com.flashcard.backend.dto.request.LoginRequest;
import com.flashcard.backend.dto.response.LoginResponse;
import com.flashcard.backend.dto.response.RegisterResponse;
import com.flashcard.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController{
    final UserService userService;
    final AuthCookieService authCookieService;

    public UserController(UserService userService, AuthCookieService authCookieService) {
        this.userService = userService;
        this.authCookieService = authCookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(
            @RequestBody @Valid LoginRequest loginRequest,
            HttpServletResponse response){
        LoginResponse loginResponse = userService.loginByClientSeed(loginRequest.getClientSeed());
        authCookieService.writeAuthCookies(
                response,
                userService.issueJwtForClientSeed(loginRequest.getClientSeed()),
                loginRequest.getClientSeed());
        return  ResponseEntity.ok(new ApiResponse<>(true,"login success",loginResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(
            @RequestBody @Valid LoginRequest registerRequest,
            HttpServletResponse response){
        RegisterResponse registerResponse = userService.registerUser(registerRequest.getClientSeed());
        authCookieService.writeAuthCookies(
                response,
                userService.issueJwtForClientSeed(registerRequest.getClientSeed()),
                registerRequest.getClientSeed());
        return ResponseEntity.ok(new ApiResponse<>(true,"register success",registerResponse));
    }

    @PostMapping("/login-from-cookie")
    public ResponseEntity<ApiResponse<?>> loginFromCookie(
            @CookieValue(name = AuthCookieService.CLIENT_SEED_COOKIE, required = false) String clientSeed,
            HttpServletResponse response) {
        if (clientSeed == null || clientSeed.isBlank()) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "client seed cookie is missing", null));
        }

        LoginResponse loginResponse = userService.loginByClientSeed(clientSeed);
        authCookieService.writeAuthCookies(
                response,
                userService.issueJwtForClientSeed(clientSeed),
                clientSeed);
        return ResponseEntity.ok(new ApiResponse<>(true, "login success", loginResponse));
    }
}
