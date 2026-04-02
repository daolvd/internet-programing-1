package com.flashcard.backend.service;

import com.flashcard.backend.common.ObjectMapperUtils;
import com.flashcard.backend.dto.response.LoginResponse;
import com.flashcard.backend.dto.response.RegisterResponse;
import com.flashcard.backend.exception.NotFoundException;
import com.flashcard.backend.model.Category;
import com.flashcard.backend.model.User;
import com.flashcard.backend.repository.CategoryRepository;
import com.flashcard.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {


    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CategoryRepository categoryRepository;

    public UserService(UserRepository userRepository, JwtService jwtService, CategoryRepository categoryRepository) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.categoryRepository = categoryRepository;
    }

    public LoginResponse loginByClientSeed(String clientSeed) {
        User user = userRepository.findByClientSeed(clientSeed);
        if (user == null) throw new NotFoundException("User not found");
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserId(user.getId());
        return loginResponse;
    }

    public RegisterResponse registerUser(String clientSeed) {
        if (userRepository.findByClientSeed(clientSeed) != null) {
            throw new RuntimeException("User already exists");
        }
        User user = new User();
        user.setClientSeed(clientSeed);
        user = userRepository.save(user);
        //todo : create default category
        Category category = new Category();
        category.setName("General");
        category.setUser(user);
        categoryRepository.save(category);
        System.out.println("ID: " + user.getId());
        System.out.println("CreatedAt: " + user.getCreatedAt());
        return ObjectMapperUtils.map(user, RegisterResponse.class);
    }

    public String issueJwtForClientSeed(String clientSeed) {
        User user = userRepository.findByClientSeed(clientSeed);
        if (user == null) throw new NotFoundException("User not found");
        return jwtService.generateToken(user.getId(), user.getClientSeed());
    }
}
