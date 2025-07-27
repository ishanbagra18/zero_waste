import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import UpdateProfile from "./pages/UpdateProfile";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/MyProfile";
import VendorDashboard from "./pages/VendorDashboard";
import CreateItem from "./pages/CreateItem";
import Allitems from "./pages/Allitems";
import Getitembyid from "./pages/Getitembyid";
import Updateitem from "./pages/Updateitem";
import NgoDashboard from "./pages/NgoDashboard";
import MyClaimed from "./pages/MyClaimed";
import Notifications from "./pages/Notifications";
import Allngos from "./pages/Allngos";
import Allvendors from "./pages/Allvendors";
import Neartongo from "./pages/Neartongo";
import Chatbot from "./components/Chatbot";
import Readmore from "./pages/Readmore";
import Chatting from "./pages/Chatting";
import SendReview from "./pages/SendReview";
import AllReviews from "./pages/AllReviews";
import Volunteerdashboard from "./pages/Volunteerdashboard";
import BookVolunteer from "./pages/BookVolunteer";
import Bookingform from "./pages/Bookingform";


// Import the new ProtectedRoute component
import ProtectedRoute from "./components/ProtectedRoute";
import Review from "../../backend/models/Review.model";

const AppContent = () => {
  const location = useLocation();
  const hideChatbot = location.pathname.startsWith("/chatting/");

  return (
    <>
      <Routes>
        {/* ====================================================== */}
        {/* Public Routes (Accessible to everyone) */}
        {/* ====================================================== */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/review/:id" element={<SendReview />} />
        <Route path="/allreview/:id" element={<AllReviews/>}/>
        <Route path="/vendor/allitems" element={<Allitems />} />
        <Route path="/vendor/item/:id" element={<Getitembyid />} />
        <Route path="/Volunteer/dashboard" element={<Volunteerdashboard />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/bookingform/:id" element={<Bookingform />} />







        {/* ====================================================== */}
        {/* Protected Routes for BOTH Vendor and NGO */}
        {/* ====================================================== */}
        <Route element={<ProtectedRoute allowedRoles={['vendor', 'NGO','Volunteer']} />}>
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

      {!hideChatbot && <Chatbot />}
    </>
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