package com.flashcard.backend.exception;

public class BusinessLogicException extends RuntimeException{
    public BusinessLogicException(String message) {
        super(message);
    }
}
