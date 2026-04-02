package com.flashcard.backend.controller;

import com.flashcard.backend.common.AuthCookieService;
import com.flashcard.backend.exception.GlobalExceptionHandler;
import com.flashcard.backend.service.DeckService;
import com.flashcard.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {UserController.class, DeckController.class})
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthCookieService authCookieService;

    @MockBean
    private DeckService deckService;

    @Test
    void loginReturnsBadRequestWhenClientSeedIsBlank() throws Exception {
        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "clientSeed": "   "
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("clientSeed is required"));

        verifyNoInteractions(userService, authCookieService);
    }

    @Test
    void createDeckReturnsBadRequestWhenCategoryIdIsMissing() throws Exception {
        mockMvc.perform(post("/api/deck/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Deck Java"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("categoryId is required"));

        verifyNoInteractions(deckService);
    }

    @Test
    void getDecksReturnsBadRequestWhenCategoryIdIsNegative() throws Exception {
        mockMvc.perform(get("/api/deck/get-all")
                        .param("categoryId", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("categoryId must be positive"));

        verifyNoInteractions(deckService);
    }
}
