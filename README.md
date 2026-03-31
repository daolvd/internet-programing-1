# Flashcard Learning Platform

A full-stack flashcard study website that helps users create, organise, review, and track flashcards in one single-page application.

## Problem This Website Solves

Many students store revision questions in scattered notes or static quiz tools that do not support structured review, progress tracking, or reusable study flows. This website solves that problem by letting users create flashcards, group them into categories and decks, study them in interactive review modes, and monitor learning performance over time. Instead of switching between different tools for creation, study, and tracking, the user can complete the whole workflow in one place.

## Technical Stack

- Frontend: React 19, TypeScript, Vite
- Styling: Tailwind CSS, reusable UI states, responsive layouts, dark mode toggle
- Routing: React Router with SPA-style client-side navigation
- Data/API: Spring Boot REST API, JWT-backed client session, MySQL database
- Deployment/Infrastructure: Docker Compose, Nginx reverse proxy, containerised frontend and backend

## Feature List

- Single-page application routing with component swaps instead of loading new HTML pages
- Full CRUD for categories, decks, cards, study sessions, and card reviews
- Quickview mode for simple question-answer review
- Learn mode with answer checking and card difficulty selection
- Search bar to find cards and jump directly into review
- Recent decks panel for quick return to active study sets
- Statistics dashboard showing mastery, efficiency, retention, accuracy, and streak
- Responsive mobile-friendly layouts across dashboard, decks, study, and stats
- Modal-based create/edit flows instead of separate pages
- Dark mode switch in the header menu
- Button feedback, active states, and keyboard-friendly modal interactions

## Folder Structure

- `frontend/`
  React SPA source code, pages, shared components, hooks, constants, and API service logic.
- `backend/backend/`
  Spring Boot application containing controllers, services, repositories, DTOs, models, and tests.
- `docker-compose.yml`
  Starts MySQL, backend API, and frontend web server together for local development/demo.
- `ERD.png`
  Entity relationship diagram used for the project database design.
- `assignment-1/`
  Supporting coursework folder kept inside the repository workspace.

## Architecture Summary

- `mysql`: stores persistent application data
- `backend`: exposes REST endpoints on port `8080`
- `frontend`: built with Vite and served through Nginx on port `5173`
- Nginx also proxies `/api/*` requests to the backend so the frontend behaves like one integrated app

## How To Run The Project

### Prerequisites

- Docker Desktop, or Docker Engine with Docker Compose

### Start all services

From the repository root:

```bash
docker compose up --build
```

### Access the application

- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MySQL: `localhost:3306`

### Stop services

```bash
docker compose down
```

### Remove services and database volume

```bash
docker compose down -v
```

## Notes About The Website

- The app behaves as an SPA, so navigation happens through routes, modals, and component updates rather than loading multiple HTML pages.
- The frontend is served through Nginx instead of the Vite dev server in the Docker setup.
- The backend waits for MySQL health checks before startup in Docker.

## Challenges Overcome

One challenge was making the website feel like a true SPA while still supporting several workflows such as deck management, review mode, and analytics inside one interface. Another challenge was connecting local UI responsiveness with backend persistence so that CRUD actions feel immediate but still map to real database operations. It was also necessary to redesign several screens for better mobile responsiveness because dashboard cards, statistics panels, and modal forms behave very differently on smaller viewports. Accessibility and interaction polish were another focus area, especially for modal keyboard handling, button feedback, and clearer focus states. Finally, the project required balancing a clean study-focused UI with enough business logic to make the application feel realistic rather than overly simplistic.
