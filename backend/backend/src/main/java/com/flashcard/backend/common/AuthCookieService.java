package com.flashcard.backend.common;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {

    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String CLIENT_SEED_COOKIE = "client_seed";

    private final long accessTokenMaxAgeSeconds;
    private final long clientSeedMaxAgeSeconds;
    private final boolean secureCookie;

    public AuthCookieService(
            @Value("${jwt.expiration}") long accessTokenMaxAgeSeconds,
            @Value("${app.auth.client-seed-cookie-max-age:31536000}") long clientSeedMaxAgeSeconds,
            @Value("${app.auth.cookie-secure:false}") boolean secureCookie) {
        this.accessTokenMaxAgeSeconds = accessTokenMaxAgeSeconds;
        this.clientSeedMaxAgeSeconds = clientSeedMaxAgeSeconds;
        this.secureCookie = secureCookie;
    }

    public void writeAuthCookies(HttpServletResponse response, String accessToken, String clientSeed) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenMaxAgeSeconds).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(CLIENT_SEED_COOKIE, clientSeed, clientSeedMaxAgeSeconds).toString());
    }

    private ResponseCookie buildCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }
}
