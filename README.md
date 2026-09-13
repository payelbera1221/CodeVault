# CodeVault 🚀

A modern, full-stack coding practice and problem-solving platform where developers can discover algorithms, write code in an interactive workspace, execute solutions against test suites, and track progress.

---

## 🌟 Features

- **Problem Discovery & Filtering**: Search problems across algorithms and data structures, filter by difficulty (*Easy*, *Medium*, *Hard*) and topic tags.
- **Problem Detail Overview**: View in-depth problem statements, input/output formats, constraints, and sample test cases.
- **Interactive Solver Workspace**: Write code in an online code editor with live syntax highlighting, sample test case execution, and multi-test verification.
- **Isolated Code Execution Engine**: Backend code runner compiles and executes Java code in a controlled subprocess environment with timeouts and memory constraints.
- **Automated Test Evaluation**: Run submissions against both public and hidden test cases, returning granular results (*Accepted*, *Wrong Answer*, *Compilation Error*, *Runtime Error*).
- **Auto Data Seeder**: Automatically initializes starter problems (*Two Sum*, *Binary Search*, *Longest Common Subsequence*) with full solutions on first boot.
- **3D Animated Showcase**: Built-in 12-page static WebGL/Three.js showcase website (`codevault-site/`) demonstrating the platform vision and planned community features.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom 3D card tilts, glow effects, and dark cyber aesthetic
- **UX & Motion**: Custom animations, dynamic stats counters, and victory confetti celebration

### Backend
- **Framework**: Spring Boot 4.0
- **Language**: Java 21+
- **Persistence**: Spring Data MongoDB
- **Execution Sandbox**: Custom ProcessBuilder-based `JavaCodeExecutor` with strict time bounds

### Database
- **Engine**: MongoDB (running locally on port `27017` or via cloud URI)

---

## 📁 Repository Structure

```
CodeVault/
├── backend/                  # Spring Boot 4 Java backend
│   ├── src/main/java/        # Controllers, Services, Repositories, Sandbox & Entities
│   │   └── com/codevault/backend/
│   │       ├── config/       # DataInitializer (auto-seeds database)
│   │       ├── controller/   # REST APIs: Problems, Execution, Submissions
│   │       ├── entity/       # MongoDB document models & DTOs
│   │       ├── execution/    # JavaCodeExecutor subprocess sandbox
│   │       ├── repository/   # Spring Data MongoDB repositories
│   │       └── service/      # Business logic & submission verification
│   ├── pom.xml               # Maven configuration
│   └── mvnw / mvnw.cmd       # Maven Wrapper
│
├── frontend/                 # Next.js 16 TypeScript web application
│   ├── app/
│   │   ├── page.tsx          # Problem discovery dashboard with search & difficulty filters
│   │   ├── problems/[id]/    # Problem details and specifications
│   │   │   ├── page.tsx      # Overview & test cases view
│   │   │   └── solve/page.tsx# Interactive code editor, test runner & submission
│   │   └── components/       # AnimatedNumber, Confetti, TiltCard
│   └── package.json
│
├── codevault-site/           # 12-page static WebGL/Three.js showcase site
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Java**: JDK 21 or higher
- **Node.js**: v18.0 or higher (`npm` installed)
- **MongoDB**: Running locally at `mongodb://localhost:27017` or configured via `application.properties`

### 2. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
> The backend will start on `http://localhost:8080` and automatically populate MongoDB with starter problems on first boot.

To run backend tests:
```bash
./mvnw test
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
> Open [http://localhost:3000](http://localhost:3000) in your browser.

To produce a production build:
```bash
npm run build
```

### 4. Explore the Static Showcase
Simply open `codevault-site/index.html` in any modern web browser or serve it via a local HTTP server:
```bash
npx serve codevault-site
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/problems` | List all available coding problems |
| `GET` | `/api/problems/{id}` | Retrieve problem details by ID |
| `GET` | `/api/problems/search` | Search problems by `difficulty`, `topic`, or `technique` |
| `POST` | `/api/problems` | Create a new coding problem |
| `PUT` | `/api/problems/{id}` | Update an existing problem |
| `DELETE` | `/api/problems/{id}` | Delete a problem |
| `POST` | `/api/execute` | Execute raw code with custom input |
| `POST` | `/api/submissions` | Submit solution code against all problem test cases |

---

## 📄 License

This project is licensed under the MIT License.