# ZeroWaste ♻️

ZeroWaste is a professional surplus food and resource redistribution platform designed to bridge the gap between businesses with excess food and communities in need. By connecting local food vendors (restaurants, grocery stores) with NGOs and local volunteers, ZeroWaste streamlines the donation, tracking, and logistics process to minimize food waste and optimize charitable giving.

---

## 📋 Table of Contents
1. [What It Does](#-what-it-does)
2. [Why I Built This](#-why-i-built-this)
3. [Architecture Decisions](#%EF%B8%8F-architecture-decisions)
4. [What I Used AI For](#%EF%B8%8F-what-i-used-ai-for)
5. [What I Would Change with 4 More Weeks](#-what-i-would-change-with-4-more-weeks)
6. [How to Run It](#%EF%B8%8F-how-to-run-it)
   - [Prerequisites](#prerequisites)
   - [Backend Configuration](#backend-setup)
   - [Frontend Configuration](#frontend-setup)
   - [Starting the Application](#starting-the-application)

---

## 🌟 What It Does
ZeroWaste solves the logistics and synchronization gap in food donation by linking surplus food donors (Vendors) directly with charities (NGOs) and delivery partners (Volunteers) in real-time. Vendors post details and pictures of edible surplus food, which NGOs can view and claim based on location. Volunteers accept delivery tasks, and the handoff is secured through a robust, OTP-based verification flow to ensure that food reaches its intended beneficiaries safely and accountably.

---

## 💡 Why I Built This
Food insecurity and massive food waste exist side-by-side in almost every urban area—restaurants throw away perfectly edible surplus at closing time while nearby shelters struggle to secure ingredients. Traditional donation pipelines are slow, chaotic, and lack transparency, forcing donors to manually call around or risk health-code issues. I built ZeroWaste to replace this fragmented system with a synchronized, tech-first platform that uses real-time alerts, location tracking, and secure verification to make surplus redistribution as fast and reliable as a modern commercial delivery service.

---

## 🛠️ Architecture Decisions

### 1. Unified Express/Node.js Backend Monolith with Role-Based Routing
* **Decision:** We opted for a structured monolithic Express API instead of separate microservices for routing, messaging, and inventory.
* **Why:** A monolithic structure simplifies authentication (JWT cookies and headers) and maintains state consistency across users, items, and bookings. By utilizing clean modular routers under `/routes` and controllers under `/controller`, we keep the codebase maintainable and fast to scale, without incurring the network latency and DevOps complexity of microservices.

### 2. Socket.io for Bidirectional Real-time Communication
* **Decision:** Socket.io is integrated on top of our HTTP server to handle user messages, claim updates, and pickup notifications.
* **Why:** Standard HTTP polling increases database read load and causes lag in coordination. Real-time updates are critical when handling perishable food. Websockets allow volunteers to accept bookings instantly and enable vendors and NGOs to chat in real-time regarding coordinate points.

### 3. Native OTP-based Handoff State Machine
* **Decision:** We built an internal verification state machine that generates unique OTPs when an item is claimed or a volunteer booking is initiated. 
* **Why:** In food distribution, accountability is vital to prevent theft and safety issues. Instead of expensive scanner hardware or third-party SMS-based services, the creator generates a code in-app, which must be keyed in by the handler at the pickup and delivery locations to advance the order state. 

### 4. Gemini-2.0-Flash Integration for Waste Management Assistance
* **Decision:** We connected Google's Gemini-2.0-flash model directly on the backend to power our built-in help desk.
* **Why:** Rather than maintaining a rigid FAQ matching script or a heavy custom NLP model, the Gemini API allows the platform to provide context-aware, immediate advice to donors on food safety standards, shelf-life estimation, and sustainable packaging.

---

## 🤖 What I Used AI For

### 📦 Generated Parts
* **Styling Templates:** Generated modern, glassmorphic styling utilities using Tailwind CSS classes for dashboard layouts.
* **Boilerplate Scripts:** Generated baseline configuration wrappers for Cloudinary image uploads and standard Mongoose schema frameworks.
* **Component Outlines:** Generated initial configurations for charting libraries (Recharts) and interactive maps (Leaflet).

### ✍️ Hand-written & Custom Logic
* **State Machine for OTP Verification:** Written from scratch to strictly validate states before updating mongo documents (e.g., preventing a volunteer from marking an item as delivered without the corresponding NGO inputting the OTP).
* **JWT Cookie & Authentication Guards:** Custom middleware created to intercept requests, decode custom payloads, and map vendor/NGO roles securely.
* **Real-time Event Synchronization:** Handcrafted the specific namespaces and connection event mappings (`addUser`, `sendMessage`, `getMessage`) inside `index.js`.

### 🔄 Overridden AI Suggestions & Rationale
* **WebRTC for Chat:** The AI initially recommended using WebRTC for peer-to-peer messaging. We rejected this because peer-to-peer setups do not persist messages out-of-the-box. We opted for a Socket.io backend-persistent chat architecture so that conversation histories are stored in MongoDB for transparency and resolution of donation disputes.
* **Third-Party Auth Services:** The AI suggested Auth0 for user profiles. We overrode this in favor of a native Express/bcrypt login flow to keep user profile data, roles (Vendor, NGO, Volunteer), and local geographic locations unified in a single database.

---

## 🚀 What I Would Change with 4 More Weeks

If preparing to ship ZeroWaste to thousands of real-world users, we would prioritize the following:

1. **Live GPS Routing & Geofencing:** Integrate the Leaflet maps with real-time GPS tracking for active volunteer runs. We would use geofencing to auto-confirm when a volunteer enters a 50-meter radius of the vendor/NGO location, simplifying the check-in process.
2. **Offline Mode & PWA Support:** Turn the frontend into a Progressive Web App (PWA) using Service Workers. Volunteers picking up food in basements or restaurant loading bays frequently experience low connectivity; offline sync would cache item states and queue actions until network availability is restored.
3. **SMS & WhatsApp Verification Gateways:** Integrate a communications API (like Twilio) to text OTP codes and status alerts directly to NGO coordinators and volunteers, removing the requirement to keep the web app open at all times.
4. **AI-powered Freshness/Spoilage Classifier:** Integrate a camera-based visual assessment API in the item upload form. Vendors could take a picture of the food, and the model would evaluate visual freshness, predicting the remaining safe-consumption window before allowing it to be posted.

---

## ⚙️ How to Run It

### Prerequisites
* **Node.js** (v16+ recommended)
* **npm** (v8+ recommended)
* **MongoDB Atlas** account or local MongoDB instance

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and supply the following variables:
   ```env
   PORT=3002
   MONGODB_URI=your_mongodb_connection_string
   JWT_TOKEN=your_jwt_secret_key
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   BOT_API_KEY=your_google_gemini_api_key
   BOT_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```

---

### Starting the Application

You need to run both the backend and frontend simultaneously.

* **Start the Backend Server:**
  ```bash
  cd backend
  npm run dev
  ```
  *The backend will run on* [http://localhost:3002](http://localhost:3002)

* **Start the Frontend Dev Server:**
  ```bash
  cd frontend
  npm run dev
  ```
  *The frontend will run on* [http://localhost:5173](http://localhost:5173)

Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the platform.
