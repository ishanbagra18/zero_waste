# ZeroWaste ♻️

ZeroWaste is a professional surplus food and resource redistribution platform designed to bridge the gap between businesses with excess food and communities in need. By connecting local food vendors (restaurants, grocery stores) with NGOs and local volunteers, ZeroWaste streamlines the donation, tracking, and logistics process to minimize food waste and optimize charitable giving.

---

## 📋 Table of Contents
1. [What It Does](#-what-it-does)
2. [Features](#-features)
3. [API & Page Routes](#-api--page-routes)
4. [Why I Built This](#-why-i-built-this)
5. [Architecture Decisions](#%EF%B8%8F-architecture-decisions)
6. [What I Used AI For](#%EF%B8%8F-what-i-used-ai-for)
7. [What I Would Change with 4 More Weeks](#-what-i-would-change-with-4-more-weeks)
8. [How to Run It](#%EF%B8%8F-how-to-run-it)
   - [Prerequisites](#prerequisites)
   - [Backend Configuration](#backend-setup)
   - [Frontend Configuration](#frontend-setup)
   - [Starting the Application](#starting-the-application)

---

## 🌟 What It Does
ZeroWaste solves the logistics and synchronization gap in food donation by linking surplus food donors (Vendors) directly with charities (NGOs) and delivery partners (Volunteers) in real-time. Vendors post details and pictures of edible surplus food, which NGOs can view and claim based on location. Volunteers accept delivery tasks, and the handoff is secured through a robust, OTP-based verification flow to ensure that food reaches its intended beneficiaries safely and accountably.

---

## 🚀 Features

ZeroWaste is structured around three key user roles to create a seamless end-to-end surplus redistribution ecosystem:

### 1. 🏢 Food Vendors (Restaurants, Cafes, Grocers)
* **Surplus Listings Management:** Post food donations with details (food type, quantity, expiration timestamp, pickup instructions).
* **Cloudinary Integration:** Upload high-quality pictures of the food directly to listing forms.
* **Dynamic Analytics Dashboard:** Track overall contributions, completed pickups, active donations, and reviews.
* **NGO Directory:** Browse all registered local NGOs.

### 2. 🤝 NGOs (Charity Organizations, Shelters)
* **Surplus Claiming Feed:** Browse and search all active food listings and claim them instantly.
* **Volunteer Logistics Booking:** Request and match with local Volunteers to transport food donations safely.
* **Secure OTP Handoff:** Access unique, securely generated pickup/dropoff OTP codes to ensure delivery authenticity.
* **Claims Manager:** Track claimed donations through different delivery states (claimed, in-transit, delivered).

### 3. 🚴 Volunteers (Delivery Partners)
* **Transporter Dashboard:** View incoming booking requests from local NGOs and accept delivery tasks.
* **Stateful Run Manager:** Manage delivery lifecycle states (accept, confirm pickup from vendor, confirm delivery to NGO).
* **Ratings & Profile Info:** Build reputation through ratings and feedback from vendors and NGOs.

### 🌐 Platform-wide Features
* **Secure Role-Based Authentication:** Cookie and header-backed JWT login/registration with role guards.
* **Real-time Instant Messaging (Socket.io):** Direct chat channels between Vendors, NGOs, and Volunteers to coordinate coordinates and pickup details.
* **Waste Management AI Assistant (Gemini 2.0):** An inline AI chatbot that suggests food storage, shelf-life, and ecological practices.
* **Real-time Push Notifications:** Live updates for new claims, volunteer bookings, messaging, and delivery status changes.
* **Reviews & Trust System:** Post-delivery rating and reviews system for accountability.

---

## 🛣️ API & Page Routes

### 🖥️ Frontend Page Routes (`react-router-dom`)
All routes are protected by role-based auth guards to prevent access hijacking.

| Path | Element / Component | Allowed Roles | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | `Login.jsx` | Public | User authentication login |
| `/register` | `Register.jsx` | Public | Account creation (selects Vendor, NGO, or Volunteer) |
| `/forgotpassword` | `ForgotPassword.jsx` | Public | Reset password request page |
| `/myprofile` | `MyProfile.jsx` | Public / All | View detailed profile page |
| `/updateprofile` | `UpdateProfile.jsx` | All | Edit profile info, contact details, coordinates |
| `/chatting/:id` | `Chatting.jsx` | All | Private chat screen powered by Socket.io |
| `/notifications` | `Notifications.jsx` | All | Event notifications inbox |
| `/allvendors` | `Allvendors.jsx` | All | Browse list of registered Vendors |
| `/near` | `Neartongo.jsx` | All | View nearby profiles and map listings |
| `/bookingform/:id` | `Bookingform.jsx` | All | Register or check details of delivery bookings |
| `/vendor/dashboard` | `VendorDashboard.jsx` | `vendor` | Vendor's main landing page and listing analytics |
| `/vendor/createitem` | `CreateItem.jsx` | `vendor` | Form to upload new surplus food item |
| `/vendor/updateitem/:id` | `Updateitem.jsx` | `vendor` | Edit existing surplus food item |
| `/vendor/allitems` | `Allitems.jsx` | Public / All | Browse all active listings |
| `/vendor/item/:id` | `Getitembyid.jsx` | Public / All | Comprehensive single item details page |
| `/allngos` | `Allngos.jsx` | `vendor` | Browse list of registered NGOs |
| `/readmore` | `Readmore.jsx` | `vendor` | Sustainability and food donation guidelines |
| `/ngo/dashboard` | `NgoDashboard.jsx` | `NGO` | NGO's main page listing available food posts |
| `/ngo/myclaimed` | `MyClaimed.jsx` | `NGO` | Manage current claimed foods and OTPs |
| `/ngo/bookvolunteer` | `BookVolunteer.jsx` | `NGO` | Request list of volunteers to pick up claims |
| `/Volunteer/dashboard` | `Volunteerdashboard.jsx` | `Volunteer` | Volunteer's portal to accept and track deliveries |
| `/review/:id` | `SendReview.jsx` | Public / All | Form to write review for a user |
| `/allreview/:id` | `AllReviews.jsx` | Public / All | View all reviews left for a user |

---

### ⚙️ Backend API Endpoints (`/api/...`)

#### 🔑 User Endpoints (`/api/users`)
* **`POST /register`** - Register new profile (Vendor, NGO, Volunteer).
* **`POST /login`** - Login user and issue JWT cookie.
* **`PATCH /forgot-password`** - Trigger password update.
* **`GET /logout`** - Clear cookies and log out user.
* **`PUT /updateProfile/:id`** - Update user account details.
* **`GET /myprofile/:id`** - Retrieve specific profile data.
* **`GET /allngo`** - List all registered NGOs.
* **`GET /allvendor`** - List all registered Vendors.
* **`GET /allvolunteer`** - List all registered Volunteers.

#### 📦 Item Listings (`/api/items`)
* **`POST /create-item`** - Publish new food post *(Vendor only)*.
* **`GET /get-items`** - Retrieve all active food listings.
* **`GET /my-items`** - Retrieve listings created by the caller *(Vendor only)*.
* **`DELETE /delete-item/:id`** - Delete food post *(Vendor only)*.
* **`GET /get-item/:id`** - View single food post details.
* **`PUT /update-item/:id`** - Modify food post details *(Vendor only)*.
* **`PATCH /:id/claim`** - Claim active food listing *(NGO only)*.
* **`GET /get-claimed-items`** - View claims list *(NGO only)*.
* **`PATCH /:id/claim-status`** - Update status of a claim.
* **`PATCH /:id/delivery-reached`** - Mark delivery location reached *(Volunteer only)*.
* **`PATCH /:id/pickup-confirmed`** - Confirm pickup from vendor *(Volunteer only)*.
* **`PATCH /:id/verify-otp`** - Verify final dropoff OTP code *(NGO only)*.

#### 🚴 Volunteer Delivery Bookings (`/api/book`)
* **`GET /allbooking`** - List all volunteer delivery bookings.
* **`POST /bookvolunteer/:volunteerId`** - Assign a volunteer to a claimed food item *(NGO only)*.
* **`PATCH /:id/accept`** - Accept delivery booking *(Volunteer only)*.
* **`PATCH /:id/pickup-confirmed`** - Confirm pickup from vendor *(Volunteer only)*.
* **`PATCH /:id/verify-otp`** - Verify dropoff OTP code at delivery.

#### 🤖 AI Chatbot (`/api/chat`)
* **`POST /chatbot`** - Chat query to Gemini AI assistant.

#### ✉️ Direct Messaging (`/api/message`)
* **`POST /send/:id`** - Send a message to a specific user.
* **`GET /get/:id`** - Get message history of a chat room.

#### 🔔 Notification Center (`/api/notifications`)
* **`GET /notification`** - Retrieve user notifications feed.
* **`PATCH /notification/:id/read`** - Mark a notification as read.
* **`DELETE /notification/:id`** - Clear/delete a notification.

#### ⭐ Reviews & Trust (`/api/review`)
* **`POST /:id`** - Create review & rating for a user.
* **`GET /:id`** - Get reviews and ratings list for a user.

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
