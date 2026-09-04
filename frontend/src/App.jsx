import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import non-page components eagerly
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";
import EcoMascotQuote from "./components/EcoMascotQuote";

import { useAuth } from "./context/AuthContext";

// Lazy loading page components
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UpdateProfile = lazy(() => import("./pages/UpdateProfile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const CreateItem = lazy(() => import("./pages/CreateItem"));
const Allitems = lazy(() => import("./pages/Allitems"));
const Getitembyid = lazy(() => import("./pages/Getitembyid"));
const Updateitem = lazy(() => import("./pages/Updateitem"));
const NgoDashboard = lazy(() => import("./pages/NgoDashboard"));
const MyClaimed = lazy(() => import("./pages/MyClaimed"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Allngos = lazy(() => import("./pages/Allngos"));
const Allvendors = lazy(() => import("./pages/Allvendors"));
const Neartongo = lazy(() => import("./pages/Neartongo"));
const Readmore = lazy(() => import("./pages/Readmore"));
const Chatting = lazy(() => import("./pages/Chatting"));
const SendReview = lazy(() => import("./pages/SendReview"));
const AllReviews = lazy(() => import("./pages/AllReviews"));
const Volunteerdashboard = lazy(() => import("./pages/Volunteerdashboard"));
const VolunteerBookings = lazy(() => import("./pages/VolunteerBookings"));
const BookVolunteer = lazy(() => import("./pages/BookVolunteer"));
const Bookingform = lazy(() => import("./pages/Bookingform"));

// Smooth fallback loading UI while route chunk downloads
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-slate-950">
    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-500/30"></div>
    <p className="mt-4 text-sm text-emerald-400 font-medium tracking-wide animate-pulse">Loading ZeroWaste App...</p>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const { role } = useAuth();
  const hideChatbot = location.pathname.startsWith("/chatting/");

  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgotpassword";
  const isVolunteerRole =
    (role || "").toLowerCase() === "volunteer" ||
    location.pathname.toLowerCase().includes("/volunteer");

  const hasNavbar = !isAuthPage && !isVolunteerRole;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white">
      <Toaster position="top-right" />
      <Navbar />
      
      <main className={`flex-1 w-full ${hasNavbar ? "pt-16" : ""}`}>
        <Suspense fallback={<PageLoader />}>
          <PageWrapper key={location.pathname}>
            <Routes>
              {/* ====================================================== */}
              {/* Public Routes (Accessible to everyone) */}
              {/* ====================================================== */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/review/:id" element={<SendReview />} />
              <Route path="/allreview/:id" element={<AllReviews />} />
              <Route path="/vendor/allitems" element={<Allitems />} />
              <Route path="/vendor/item/:id" element={<Getitembyid />} />
              <Route path="/Volunteer/dashboard" element={<Volunteerdashboard />} />
              <Route path="/volunteer/dashboard" element={<Volunteerdashboard />} />
              <Route path="/volunteer/recent-bookings" element={<VolunteerBookings />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/bookingform/:id" element={<Bookingform />} />

              {/* ====================================================== */}
              {/* Protected Routes for BOTH Vendor and NGO */}
              {/* ====================================================== */}
              <Route element={<ProtectedRoute allowedRoles={['vendor', 'NGO', 'Volunteer']} />}>
                <Route path="/updateprofile" element={<UpdateProfile />} />
                <Route path="/chatting/:id" element={<Chatting />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/allvendors" element={<Allvendors />} />
                <Route path="/near" element={<Neartongo />} />
              </Route>

              {/* ====================================================== */}
              {/* Protected Routes for VENDOR Only */}
              {/* ====================================================== */}
              <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/createitem" element={<CreateItem />} />
                <Route path="/vendor/updateitem/:id" element={<Updateitem />} />
                <Route path="/allngos" element={<Allngos />} />
                <Route path="/readmore" element={<Readmore />} />
              </Route>

              {/* ====================================================== */}
              {/* Protected Routes for NGO Only */}
              {/* ====================================================== */}
              <Route element={<ProtectedRoute allowedRoles={['NGO']} />}>
                <Route path="/ngo/dashboard" element={<NgoDashboard />} />
                <Route path="/ngo/myclaimed" element={<MyClaimed />} />
                <Route path="/ngo/bookvolunteer" element={<BookVolunteer />} />
              </Route>
            </Routes>
          </PageWrapper>
        </Suspense>
      </main>

      {hasNavbar && <Footer />}
      {!hideChatbot && <Chatbot />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;