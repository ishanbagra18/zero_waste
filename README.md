# Zero Waste Platform

A full-stack web application connecting vendors, NGOs, and volunteers to reduce waste and support communities. Vendors can list surplus items, NGOs can claim them, and volunteers can participate in the movement.

## Project Structure

```
backend/
  controller/
  jwt/
  middleware/
  models/
  routes/
  .env
  index.js
  package.json

frontend/
  public/
  src/
    pages/
    index.css
    App.css
  index.html
  package.json
  tailwind.config.js
  vite.config.js
```

---

## Backend

- **Tech Stack:** Node.js, Express, MongoDB, Mongoose
- **Features:**  
  - User authentication (JWT)
  - Item listing and claiming
  - Notifications
  - Reviews and feedback
  - Role-based access (vendor, NGO, volunteer)

### Setup

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Create a `.env` file with your MongoDB URI and JWT secret.
3. Start the server:
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:3002`.

---

## Frontend

- **Tech Stack:** React, Vite, Tailwind CSS, Axios
- **Features:**  
  - Modern UI for all user roles
  - Real-time notifications
  - Profile and dashboard pages
  - Review and feedback system

### Setup

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

---

## Key Pages

- **Volunteers:** View all volunteers and their details ([src/pages/Volunteers.jsx](src/pages/Volunteers.jsx))
- **Notifications:** View and manage notifications ([src/pages/Notifications.jsx](src/pages/Notifications.jsx))
- **NGO Dashboard:** NGO-specific actions and stats ([src/pages/NgoDashboard.jsx](src/pages/NgoDashboard.jsx))
- **Reviews:** Leave and view feedback ([src/pages/AllReviews.jsx](src/pages/AllReviews.jsx), [src/pages/SendReview.jsx](src/pages/SendReview.jsx))

---

## Customization

- Update Tailwind styles in [frontend/tailwind.config.js](frontend/tailwind.config.js)
- API endpoints are defined in [backend/routes/](backend/routes/)

---

## License

MIT

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
