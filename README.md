# Flashcard Learning Platform

This repository contains a full-stack flashcard learning application built for internet programming coursework.

## Project Overview

The app helps users:

- Organize cards into categories and decks
- Study in Quickview and Learn modes
- Record review history and session duration
- Track performance metrics such as mastery, efficiency, accuracy, retention, and streak

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Spring Boot (Java 21) + JPA + MySQL
- Infrastructure: Docker + Docker Compose + Nginx

## Architecture

- mysql service: persistent MySQL database
- backend service: Spring Boot REST API on port 8080
- frontend service: static Vite build served by Nginx on port 5173 (container port 80)

Frontend requests to /api/* are proxied by Nginx to the backend container.

## Run With Docker

### Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)

### Start all services

From the repository root (same level as docker-compose.yml):

docker compose up --build

### Access the application

- Frontend UI: http://localhost:5173
- Backend API: http://localhost:8080
- MySQL: localhost:3306

### Stop services

docker compose down

### Stop services and remove database volume

docker compose down -v

## Docker Files

- docker-compose.yml: orchestrates mysql, backend, and frontend
- backend/backend/Dockerfile: multi-stage build for Spring Boot jar
- frontend/Dockerfile: multi-stage build (Node build + Nginx runtime)
- frontend/nginx.conf: SPA routing + /api reverse proxy to backend

## Default Database Credentials (Development)

- Database: flashcard_db
- User: flashcard
- Password: flashcard123
- Root password: root123

These values are configured in docker-compose.yml for local development.

## Notes

- The backend waits for MySQL healthcheck before starting.
- The frontend image is production-like (Nginx static hosting), not Vite dev server.
- If you change API path behavior, update frontend/nginx.conf accordingly.
