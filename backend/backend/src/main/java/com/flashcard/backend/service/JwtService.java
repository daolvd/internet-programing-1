package com.flashcard.backend.service;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final long expirationSeconds;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationSeconds) {

        SecretKey key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");

        this.jwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        this.jwtDecoder = NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(Long userId, String clientSeed) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiresAt(now.plus(expirationSeconds, ChronoUnit.SECONDS))
                .claim("clientSeed", clientSeed)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();
    }

    public Jwt decodeToken(String token) {
        return jwtDecoder.decode(token);
    }
}
