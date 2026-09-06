# Contributing to ZeroWaste ♻️

Thank you for your interest in contributing to **ZeroWaste**! ZeroWaste is an open-source real-time surplus food redistribution ecosystem connecting food vendors, non-profit organizations (NGOs), and volunteer transporters to eliminate food waste.

We welcome contributions of all kinds: bug fixes, feature enhancements, documentation improvements, UI/UX polish, and AI prompt optimizations.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Local Setup](#local-setup)
   - [Docker Setup](#docker-setup)
3. [Project Architecture](#project-architecture)
4. [How to Contribute](#how-to-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Features](#suggesting-features)
   - [Submitting Pull Requests](#submitting-pull-requests)
5. [Development Guidelines](#development-guidelines)
   - [Frontend (React + Vite + CSS Tokens)](#frontend-react--vite--css-tokens)
   - [Backend (Node.js + Express + MongoDB + Socket.io)](#backend-nodejs--express--mongodb--socketio)
   - [Git & Commit Conventions](#git--commit-conventions)
6. [Community & Questions](#community--questions)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand our community guidelines and expectations.

---

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB Atlas** database URI or local MongoDB container
- **Docker & Docker Desktop** *(optional, for containerized development)*

### Local Setup

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/myzerowaste.git
   cd myzerowaste
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3002
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_TOKEN=your_jwt_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   BOT_API_KEY=your_gemini_api_key
   BOT_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run Development Servers**
   - **Backend**: `cd backend && npm run dev` *(Runs on http://localhost:3002)*
   - **Frontend**: `cd frontend && npm run dev` *(Runs on http://localhost:5173)*

### Docker Setup

Alternatively, launch the full stack with Docker Compose:
```bash
docker compose up --build -d
```

---

## Project Architecture

ZeroWaste is structured as a modular monorepo:

```
myzerowaste/
├── backend/
│   ├── controller/      # Express route logic (auth, items, bookings, chatbot, etc.)
│   ├── middleware/      # Authentication & Multer upload middleware
│   ├── model/           # Mongoose schemas (User, Item, Booking, Message, Review)
│   ├── routes/          # Express route definitions
│   └── server.js        # Server entry point & Socket.io initialization
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, Footer, Chatbot)
│   │   ├── pages/       # Route view pages (Login, Dashboards, MyClaimed, etc.)
│   │   └── index.css    # Design tokens & global CSS styles
│   └── nginx.conf       # Nginx production build configuration
├── docker-compose.yml   # Multi-container orchestration
└── README.md            # Main documentation
```

---

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to make sure it hasn't already been reported.

When reporting a bug, use the **[Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)** and include:
- A clear, descriptive title.
- Steps to reproduce the issue.
- Expected behavior vs actual behavior.
- Relevant logs, error stack traces, or screenshots.
- Details about your environment (OS, Node version, Browser).

### Suggesting Features

We welcome feature ideas! Use the **[Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)** to explain:
- The problem your feature solves.
- Proposed solution or feature behavior.
- Target user role (Vendor, NGO, Volunteer, or All).

### Submitting Pull Requests

1. **Find or Open an Issue**: Work on an existing issue or create one to discuss major proposed changes.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/ngo-live-tracking
   # or
   git checkout -b bugfix/otp-verification-lock
   ```
3. **Make Your Changes**: Keep commits focused and atomic.
4. **Test Thoroughly**: Ensure frontend UI renders cleanly and backend API endpoints respond correctly without breaking existing routes.
5. **Push & Create PR**: Push your branch to GitHub and submit a Pull Request using our [PR Template](.github/PULL_REQUEST_TEMPLATE.md).

---

## Development Guidelines

### Frontend (React + Vite + CSS Tokens)

- Use functional components with hooks (`useState`, `useEffect`, `useContext`, `useNavigate`).
- Follow the existing styling system in `index.css` using custom design variables (dark theme, glassmorphism, accent greens/emeralds).
- Ensure pages are responsive across mobile, tablet, and desktop breakpoints.

### Backend (Node.js + Express + MongoDB + Socket.io)

- Validate incoming request body and params before querying MongoDB.
- Use explicit HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`).
- Ensure OTP state machine transitions (`Claimed` -> `In-Transit` -> `Delivered`) remain atomic and secure.
- Clean up Socket.io connection and room event listeners to prevent memory leaks.

### Git & Commit Conventions

Write concise commit messages following standard guidelines:
- `feat: add live geolocation routing for volunteers`
- `fix: resolve OTP validation race condition on dropoff`
- `docs: update setup steps in README`
- `style: refine dashboard glassmorphism cards`

---

## Community & Questions

If you have questions, feel free to open a GitHub Discussion or reach out to the project maintainers. Thank you for contributing to a zero-waste future! 🌍♻️
