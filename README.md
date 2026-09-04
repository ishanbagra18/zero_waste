# ZeroWaste ♻️

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](https://nodejs.org)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61DAFB.svg)](https://reactjs.org)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg)](https://www.mongodb.com)
[![Realtime](https://img.shields.io/badge/Realtime-Socket.io-010101.svg)](https://socket.io)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%203.6%20Flash-4285F4.svg)](https://deepmind.google/technologies/gemini)
[![Docker](https://img.shields.io/badge/Container-Docker%20%7C%20Compose-2496ED.svg)](https://www.docker.com)

**ZeroWaste** is an end-to-end, real-time surplus food and resource redistribution ecosystem designed to bridge the gap between businesses with excess food and communities in need. By seamlessly linking local food vendors (restaurants, supermarkets, bakeries) with NGOs and volunteer delivery partners, ZeroWaste optimizes food logistics, prevents food waste, and ensures secure, transparent charitable handoffs.

---

## 📋 Table of Contents
1. [Overview & Impact](#-overview--impact)
2. [Ecosystem Architecture & Flow](#-ecosystem-architecture--flow)
3. [Key Features by User Role](#-key-features-by-user-role)
4. [Tech Stack](#-tech-stack)
5. [API & Page Routes](#-api--page-routes)
6. [Security & Verification System](#-security--verification-system)
7. [Why I Built This](#-why-i-built-this)
8. [Architecture & Design Decisions](#-architecture--design-decisions)
9. [AI Integration & Rationale](#-ai-integration--rationale)
10. [Future Roadmap (4-Week Vision)](#-future-roadmap-4-week-vision)
11. [Getting Started & Installation](#-getting-started--installation)
12. [Docker Setup & Deployment](#-docker-setup--deployment)

---

## 🌟 Overview & Impact

Every day, vast quantities of fresh, edible surplus food are discarded while community shelters and non-profit organizations face resource shortages. Traditional donation methods rely on informal phone calls or manual coordination, leading to delays, food spoilage, and lack of accountability.

**ZeroWaste** replaces fragmented communication with a synchronized digital platform:
- **Vendors** list surplus food items with expiration limits, quantity, and images.
- **NGOs** browse nearby donations, claim items instantly, and request volunteer delivery.
- **Volunteers** receive delivery assignments and execute stateful runs using secure verification codes.
- **Gemini AI & Socket.io** provide intelligent food safety advice and instant peer-to-peer messaging.

---

## 🏗️ Ecosystem Architecture & Flow

```
                 +-------------------+
                 |   Food Vendors    |
                 | (Post Surplus Food|
                 +---------+---------+
                           |
                           v
            +--------------+--------------+
            |      ZeroWaste Platform     |
            | (Express + MongoDB + Socket)|
            +-------+--------------+------+
                    |              |
                    v              v
      +-------------+--+      +----+---------------+
      |  NGO Claim Feed|      |  Volunteers (Run)  |
      |  & OTP Handoff |      |  Pickup & Delivery |
      +----------------+      +--------------------+
```

---

## 🚀 Key Features by User Role

### 1. 🏢 Food Vendors (Restaurants, Supermarkets, Cafes)
- **Surplus Food Publishing:** Create listings complete with category, quantity, expiration timers, and pickup coordinates.
- **Cloudinary Image Hosting:** Direct image upload & preview for high-resolution item verification.
- **Vendor Analytics Dashboard:** Visual metrics tracking active food listings, completed donations, and community feedback.
- **NGO Directory & Reviews:** Explore verified local NGOs and read reviews before donating.

### 2. 🤝 NGO Organizations (Charities, Shelters, Community Kitchens)
- **Real-Time Surplus Feed:** Filter, search, and claim available food donations instantly.
- **Volunteer Logistics Booking:** Dispatch nearby registered volunteers for pickup and delivery runs.
- **Dual-Phase OTP Verification:** Generate and verify unique OTP codes at vendor pickup and final delivery to guarantee chain of custody.
- **Claims Management Hub:** Monitor claimed items across states (`Claimed`, `In-Transit`, `Delivered`).

### 3. 🚴 Volunteers (Delivery Transporters)
- **Volunteer Portal:** Access delivery dispatch requests, review pickup details, and accept delivery runs.
- **Stateful Delivery Manager:** Guided UI step-by-step state machine (`Accept Run` ➔ `Confirm Pickup` ➔ `Verify Delivery OTP`).
- **Recent Bookings & Activity Log:** Track past delivery assignments, total items transported, and user reviews.

### 🌐 Platform-Wide Features
- **Role-Based Authentication & Authorization:** Cookie and JWT-based authentication with strict client and server-side route guards.
- **Real-Time Direct Messaging (Socket.io):** Instant chat channels between Vendors, NGOs, and Volunteers with persistent message history.
- **Eco-Mascot & Gemini AI Assistant:** Powered by `gemini-3.6-flash` to offer real-time advice on food preservation, shelf-life calculation, and zero-waste storage tips.
- **Real-Time Notifications:** Live status alerts for listing claims, volunteer dispatching, and OTP confirmations.
- **User Ratings & Trust System:** Post-delivery review system to build community trust and accountability.

---

## 💻 Tech Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite), React Router DOM v6 |
| **Styling & UI** | Vanilla CSS Design Tokens, Glassmorphic UI Utilities, Lucide React Icons |
| **Backend Runtime** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Realtime Messaging** | Socket.io (WebSockets) |
| **AI Integration** | Google Gemini API (`gemini-3.6-flash` with resilient model fallbacks) |
| **Media Management** | Cloudinary API (Multer middleware) |
| **Auth & Security** | JSON Web Tokens (JWT), Bcrypt password hashing, HTTP-Only Cookies |
| **Containerization** | Docker, Docker Compose, Multi-stage Nginx builds |

---

## 🛣️ API & Page Routes

### 🖥️ Frontend Page Routes (`react-router-dom`)

| Path | Component | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Login.jsx` | Public | User authentication login screen |
| `/register` | `Register.jsx` | Public | Account registration (Vendor, NGO, Volunteer) |
| `/forgotpassword` | `ForgotPassword.jsx` | Public | Password recovery flow |
| `/myprofile` | `MyProfile.jsx` | All | Account profile and user details |
| `/updateprofile` | `UpdateProfile.jsx` | Protected | Edit contact details and location parameters |
| `/chatting/:id` | `Chatting.jsx` | Protected | Private real-time chat interface |
| `/notifications` | `Notifications.jsx` | Protected | User notifications inbox |
| `/allvendors` | `Allvendors.jsx` | Protected | Directory of registered vendor accounts |
| `/near` | `Neartongo.jsx` | Protected | Interactive map view of nearby NGOs & listings |
| `/bookingform/:id` | `Bookingform.jsx` | Protected | Detailed volunteer booking summary |
| `/vendor/dashboard` | `VendorDashboard.jsx` | `vendor` | Vendor control panel & listing statistics |
| `/vendor/createitem` | `CreateItem.jsx` | `vendor` | Form to publish new surplus item |
| `/vendor/updateitem/:id` | `Updateitem.jsx` | `vendor` | Edit active item details |
| `/vendor/allitems` | `Allitems.jsx` | Public / All | Public marketplace of surplus listings |
| `/vendor/item/:id` | `Getitembyid.jsx` | Public / All | Individual food listing details & claim prompt |
| `/allngos` | `Allngos.jsx` | `vendor` | Directory of verified NGO accounts |
| `/readmore` | `Readmore.jsx` | `vendor` | Food safety guidelines & donation regulations |
| `/ngo/dashboard` | `NgoDashboard.jsx` | `NGO` | NGO main dashboard & active food claim feed |
| `/ngo/myclaimed` | `MyClaimed.jsx` | `NGO` | NGO claims manager & OTP release portal |
| `/ngo/bookvolunteer` | `BookVolunteer.jsx` | `NGO` | Dispatch volunteer delivery for claimed food |
| `/volunteer/dashboard` | `Volunteerdashboard.jsx` | `Volunteer` | Volunteer delivery portal & run acceptance |
| `/volunteer/recent-bookings`| `VolunteerBookings.jsx` | `Volunteer` | Past volunteer runs & delivery records |
| `/review/:id` | `SendReview.jsx` | Public / All | Leave feedback and star ratings for users |
| `/allreview/:id` | `AllReviews.jsx` | Public / All | View ratings and reviews for a user profile |

---

### ⚙️ Backend API Endpoints (`/api/...`)

#### 🔑 Authentication & Profiles (`/api/users`)
- `POST /api/users/register` - Create new profile (Vendor, NGO, Volunteer).
- `POST /api/users/login` - Authenticate user & set JWT cookie.
- `PATCH /api/users/forgot-password` - Reset account password.
- `GET /api/users/logout` - Invalidate session cookies.
- `PUT /api/users/updateProfile/:id` - Update user location and contact info.
- `GET /api/users/myprofile/:id` - Retrieve profile data.
- `GET /api/users/allngo` | `allvendor` | `allvolunteer` - Fetch entity lists.

#### 📦 Surplus Items Management (`/api/items`)
- `POST /api/items/create-item` - Publish new food listing *(Vendor)*.
- `GET /api/items/get-items` - List active food postings.
- `GET /api/items/my-items` - List postings created by caller *(Vendor)*.
- `DELETE /api/items/delete-item/:id` - Remove listing *(Vendor)*.
- `GET /api/items/get-item/:id` - Fetch item details.
- `PUT /api/items/update-item/:id` - Edit listing details *(Vendor)*.
- `PATCH /api/items/:id/claim` - Claim food listing *(NGO)*.
- `GET /api/items/get-claimed-items` - List claimed items *(NGO)*.
- `PATCH /api/items/:id/pickup-confirmed` - Confirm pickup from vendor *(Volunteer)*.
- `PATCH /api/items/:id/verify-otp` - Verify dropoff OTP code *(NGO/Volunteer)*.

#### 🚴 Volunteer Delivery Logistics (`/api/book`)
- `GET /api/book/allbooking` - List all delivery dispatch requests.
- `POST /api/book/bookvolunteer/:volunteerId` - Assign volunteer to claimed donation *(NGO)*.
- `PATCH /api/book/:id/accept` - Accept delivery booking *(Volunteer)*.
- `PATCH /api/book/:id/pickup-confirmed` - Confirm vendor pickup *(Volunteer)*.
- `PATCH /api/book/:id/verify-otp` - Complete delivery with OTP verification.

#### 🤖 AI Assistant (`/api/chat`)
- `POST /api/chat/chatbot` - Interact with Gemini AI assistant for storage & eco guidance.

#### ✉️ Peer Messaging (`/api/message`)
- `POST /api/message/send/:id` - Transmit direct message.
- `GET /api/message/get/:id` - Load conversation message history.

#### 🔔 Notifications & Reviews (`/api/notifications`, `/api/review`)
- `GET /api/notifications/notification` - Retrieve notification stream.
- `PATCH /api/notifications/notification/:id/read` - Mark notification as read.
- `POST /api/review/:id` - Post review & star rating for a user.
- `GET /api/review/:id` - Fetch user feedback history.

---

## 🔒 Security & Verification System

To prevent food theft, misdirection, and unauthorized claims, ZeroWaste utilizes an in-app **Dual-Phase OTP State Machine**:

```
[Listing Created] ➔ [NGO Claims Listing] ➔ [OTP Generated for Handoff]
                                                   │
                                                   ▼
[Volunteer Reaches NGO/Vendor] ◄── [Volunteer Accepts Run & Pickup]
               │
               ▼
[OTP Verified on Dropoff] ➔ [Status Updated to Delivered]
```

1. **Pickup Phase:** Volunteer arrives at the donor vendor's location and confirms pickup state in-app.
2. **Delivery Handoff:** The receiving NGO displays an in-app unique OTP code.
3. **Verification:** The Volunteer keys in the OTP, releasing the claim status to `Delivered` in MongoDB atomically.

---

## 💡 Why I Built This

In urban areas, food waste and community hunger exist side by side. Supermarkets and restaurants regularly dispose of high-quality edible inventory simply because of inventory rotation or near-term expiration dates.

Traditional food bank models suffer from scheduling friction and high transport costs. ZeroWaste solves this by turning surplus redistribution into an agile, on-demand network—combining real-time geolocation matching, crowdsourced volunteer transport, and automated chain-of-custody verification.

---

## 🛠️ Architecture & Design Decisions

### 1. Unified Modular Express Architecture
- **Decision:** Built a clean modular monolith architecture rather than fragmented microservices.
- **Rationale:** Keeps authentication, Socket.io websockets, and MongoDB transaction logic in single-hop sync, reducing network overhead and deployment complexity.

### 2. Socket.io WebSockets for Real-Time State & Messaging
- **Decision:** Integrated Socket.io for live chat, notification delivery, and status propagation.
- **Rationale:** Perishable food requires immediate action. WebSockets eliminate latency inherent in polling, allowing NGOs and volunteers to react instantly.

### 3. Gemini 3.6 Flash Integration
- **Decision:** Backend integration with Google Gemini 3.6 Flash with fallback mechanisms.
- **Rationale:** Delivers intelligent, instant answers to complex user questions regarding food safety compliance, storage temperatures, and expiration estimation.

---

## 🤖 AI Integration & Rationale

- **Generative Design Assistance:** Used AI for initial UI layout structuring, CSS theme variables, and sample schema design.
- **Custom-Engineered Core Logic:** 
  - Dual-phase OTP validation state transitions created manually to prevent race conditions.
  - Custom JWT cookie middleware and role authorization guards engineered from scratch.
  - Custom Socket.io connection and room lifecycle event handlers written explicitly for database persistence.
- **Architectural Overrides:**
  - Rejected WebRTC peer-to-peer chat suggestions in favor of Socket.io + MongoDB to retain message history for dispute resolution.
  - Overrode third-party identity provider suggestions (e.g. Auth0) to maintain direct control over user role models and location coordinates.

---

## 🚀 Future Roadmap (4-Week Vision)

1. **GPS Live Tracking & Geofencing:** Integrate Leaflet live routing to auto-detect when a volunteer enters a 50m radius of vendor/NGO coordinates.
2. **Offline PWA Support:** Implement Service Workers and IndexedDB to allow volunteers to update delivery statuses in low-connectivity areas (e.g., basements or loading bays).
3. **Twilio SMS & WhatsApp Gateway:** Send instant OTP and status alerts via SMS so coordinators without active data connections can verify handoffs.
4. **Visual Spoilage Assessment AI:** Enable camera uploads in the listing form to automatically predict food shelf-life before posting.

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB Atlas** database URI

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create a .env file with the following variables
PORT=3002
MONGODB_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
BOT_API_KEY=your_google_gemini_api_key
BOT_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent
```

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

### 3. Running the Application

Open two terminal sessions to launch both servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*Backend runs on:* `http://localhost:3002`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

Access the web application by opening [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Setup & Deployment

You can run the entire ZeroWaste application using Docker and Docker Compose without manually installing Node.js or local dependencies.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Build and Run with Docker Compose

Ensure your `backend/.env` file is configured, then execute:

```bash
# Build images and start all services in detached mode
docker compose up --build -d
```

- **Frontend App:** Accessible at [http://localhost](http://localhost) (Port `80` or `5173`)
- **Backend API:** Accessible at [http://localhost:3002](http://localhost:3002)
- **Health Check:** Test backend connectivity at `http://localhost:3002/health`

### 2. Optional: Run with Local MongoDB Container

To run the app with a dedicated local MongoDB container instead of MongoDB Atlas:

```bash
docker compose --profile local-db up --build -d
```

### 3. Stop Containers

```bash
docker compose down
```

---

<p align="center">Made with ❤️ for Zero Waste and Sustainable Communities</p>

