♻️ Zero Waste Platform
A full-stack web application that bridges the gap between vendors, NGOs, and volunteers to minimize waste and support local communities.

📁 Project Structure
pgsql
Copy
Edit
zero-waste-platform/
│
├── backend/
│   ├── controller/
│   ├── jwt/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── public/
    └── src/
        ├── pages/
        ├── App.css
        ├── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
🔧 Tech Stack
Backend
Node.js, Express.js

MongoDB with Mongoose

JWT Authentication

Cloudinary for image hosting

Frontend
React with Vite

Tailwind CSS

Axios for API requests

⚙️ Setup Instructions
1. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file with:

env
Copy
Edit
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
Start the backend server:

bash
Copy
Edit
npm start
🔗 Runs at http://localhost:3002

2. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
🔗 Runs at http://localhost:5173

🚀 Features
🛒 Vendor
List surplus or expiring items

Manage item claims from NGOs

Track delivery and impact

🏥 NGO
View and claim available items

Track claim statuses

Rate and review volunteers

🙋 Volunteer
Register and update profiles

View assigned tasks

Receive real-time notifications

🔔 Common
JWT-based secure login

Role-based access

Real-time notification system

Cloudinary image upload

Reviews and ratings

📄 Key Pages
Page	Description
Volunteers.jsx	View all volunteers and their details
Notifications.jsx	Notification system for status updates
NgoDashboard.jsx	NGO dashboard with actions and statistics
AllReviews.jsx	View all received reviews
SendReview.jsx	Send feedback or rate volunteers

🎨 Customization
Tailwind styles can be edited in frontend/tailwind.config.js

API routes are defined under backend/routes/

🤝 Contributing
We welcome contributions from everyone!
To contribute:

Fork the repo

Create your feature branch (git checkout -b feature-name)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature-name)

Open a pull request

📄 License
This project is licensed under the MIT License.

🌟 Acknowledgements
Thanks to all the contributors and the open-source community that made this project possible.
