# Flashcard Learning Platform

A full-stack study application for creating flashcards, grouping them into decks and categories, reviewing them in a browser-based study flow, and tracking learning performance over time.

## Problem This Website Solves

Students often manage study cards across scattered notes, screenshots, or static quiz apps that do not provide structure or feedback. This project solves that by giving users one place to create flashcards, organise them by category and deck, study them in interactive modes, and review their progress with analytics such as streak, accuracy, retention, and total study time.

## Technical Stack

- Frontend: React 19, TypeScript, Vite, React Router, Tailwind CSS
- Styling and UI: Tailwind utility classes, reusable modal and notification providers, Lucide icons
- Routing: Client-side SPA routing with `BrowserRouter` and nested layout routes
- Data and API: Spring Boot REST API, JWT-backed API client, MySQL persistence
- Infrastructure: Docker Compose and Nginx reverse proxy for SPA hosting and `/api` forwarding

## Feature List

- Single-page application flow with client-side routing
- Full CRUD for categories, decks, cards, study sessions, and card reviews
- Quickview and Learn study modes
- Search across flashcards and jump straight into review mode
- Recent decks dashboard for faster study access
- Analytics dashboard with mastery, efficiency, accuracy, retention, and streak metrics
- Mobile-responsive layouts for dashboard, deck management, and statistics views
- Accessible modal and confirmation dialogs with keyboard escape handling and focus management
- Docker-based local development setup

## Folder Structure

- `frontend/`: React SPA, page components, shared UI, hooks, and API service layer
- `backend/backend/`: Spring Boot application with controllers, services, repositories, DTOs, models, and tests
- `docker-compose.yml`: starts MySQL, backend API, and frontend web server together
- `ERD.png`: database relationship diagram used for planning the application data model
- `assignment-1/`: supporting coursework folder kept in the repository workspace

## Architecture Summary

- `mysql`: persistent MySQL database for application data
- `backend`: Spring Boot API on port `8080`
- `frontend`: production-style Vite build served through Nginx on port `5173`
- Nginx handles SPA route fallback and proxies `/api/*` requests to the backend service

## Run With Docker

### Prerequisites

- Docker Desktop or Docker Engine with Docker Compose

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

### Stop services and remove database volume

```bash
docker compose down -v
```

## Development Notes

- The backend waits for MySQL health checks before startup in Docker
- The frontend is served via Nginx rather than the Vite dev server in the container setup
- Frontend routes are handled as an SPA, so page transitions do not require loading a different HTML document

## Challenges Overcome

One major challenge was keeping the application feeling like a real SPA while still supporting multiple business flows such as deck management, review mode, and analytics in one interface. Another challenge was coordinating frontend optimistic updates with backend persistence so that users get immediate feedback without losing database-backed CRUD functionality. The statistics page also required translating raw review and study-session data into metrics that feel meaningful to users rather than just dumping backend values. On the infrastructure side, Docker and Nginx were added so the app can be demonstrated in a more deployment-like environment instead of relying on separate manual startup steps. Finally, accessibility and mobile responsiveness needed deliberate improvements because management modals, dashboards, and tables all behave differently on smaller screens and keyboard-driven interactions.
