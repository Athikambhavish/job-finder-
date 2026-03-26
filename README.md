# 🔍 FinderAI — Full-Stack Job Finder

A full-stack job board built with **Vite + React**, **Spring Boot**, **MySQL**, and **Docker Compose**.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│              Docker Compose Network             │
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐   │
│  │  Frontend    │    │      Backend          │   │
│  │  Vite/React  │───▶│  Spring Boot 3.2     │   │
│  │  Nginx :80   │    │  REST API :8080      │   │
│  └──────────────┘    └──────────┬───────────┘   │
│                                  │               │
│                       ┌──────────▼───────────┐   │
│                       │       MySQL 8.0       │   │
│                       │     :3306            │   │
│                       └──────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Run everything in one command
```bash
docker compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:8080        |
| MySQL    | localhost:3306               |

---

## 📁 Project Structure

```
jobfinder/
├── docker-compose.yml          # Orchestrates all services
├── docker/
│   └── init.sql                # DB schema + seed data
│
├── backend/                    # Spring Boot app
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/jobfinder/
│       ├── JobFinderApplication.java
│       ├── config/CorsConfig.java
│       ├── model/              # JPA entities
│       │   ├── Job.java
│       │   ├── Company.java
│       │   ├── Application.java
│       │   └── SavedJob.java
│       ├── dto/                # Request/Response DTOs
│       │   ├── JobDTO.java
│       │   └── ApplicationDTO.java
│       ├── repository/         # Spring Data JPA repos
│       │   ├── JobRepository.java
│       │   ├── ApplicationRepository.java
│       │   └── SavedJobRepository.java
│       ├── service/            # Business logic
│       │   ├── JobService.java
│       │   ├── ApplicationService.java
│       │   └── SavedJobService.java
│       └── controller/         # REST controllers
│           ├── JobController.java
│           ├── ApplicationController.java
│           ├── SavedJobController.java
│           └── GlobalExceptionHandler.java
│
└── frontend/                   # Vite + React app
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx             # Router + Nav
        ├── index.css
        ├── services/api.js     # Axios API client
        ├── hooks/useJobFinder.js  # Custom React hooks
        ├── components/JobComponents.jsx  # Reusable UI
        └── pages/
            ├── Browse.jsx      # Search + job list
            ├── Saved.jsx       # Saved jobs
            └── Applications.jsx  # My applications
```

---

## 🔌 REST API Reference

### Jobs
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | `/api/jobs`          | List all active jobs     |
| GET    | `/api/jobs/{id}`     | Get single job           |
| GET    | `/api/jobs/search`   | Search with filters      |

**Search params:** `keyword`, `location`, `type` (FULL_TIME/CONTRACT/…), `remote` (true/false)

### Saved Jobs
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/saved`        | Get saved jobs           |
| GET    | `/api/saved/ids`    | Get saved job IDs        |
| POST   | `/api/saved/{id}`   | Toggle save/unsave       |

### Applications
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/applications`    | Submit application       |
| GET    | `/api/applications/my` | My applications          |

> **Auth note:** User ID is passed via `X-User-Id` header (defaults to `1`). Replace with JWT auth for production.

---

## 🛠 Local Development (without Docker)

### Backend
```bash
cd backend
# Requires Java 17 + MySQL running locally
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

---

## 🔧 Environment Variables

| Variable                         | Default                            |
|----------------------------------|------------------------------------|
| `SPRING_DATASOURCE_URL`          | `jdbc:mysql://localhost:3306/jobfinder...` |
| `SPRING_DATASOURCE_USERNAME`     | `jobuser`                          |
| `SPRING_DATASOURCE_PASSWORD`     | `jobpassword`                      |
| `SPRING_JPA_HIBERNATE_DDL_AUTO`  | `validate`                         |

---

## 🧩 Next Steps / Production Checklist

- [ ] Add JWT authentication (Spring Security)
- [ ] Add user registration & profiles
- [ ] Integrate real job board APIs (LinkedIn, Indeed, Greenhouse)
- [ ] Add AI job matching via Claude API
- [ ] Add resume upload to S3
- [ ] Add email notifications on application status change
- [ ] Add pagination for job listings
- [ ] Set up CI/CD pipeline
