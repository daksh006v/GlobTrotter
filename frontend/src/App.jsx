import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import useAuthStore from "./store/authStore";

// Lazy-loaded or standard imports for pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import CreateTrip from "./pages/CreateTrip";
import ItineraryView from "./pages/ItineraryView";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import Budget from "./pages/Budget";
import Timeline from "./pages/Timeline";
import CitySearch from "./pages/CitySearch";
import ActivitySearch from "./pages/ActivitySearch";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import PublicShare from "./pages/PublicShare";

export default function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/share/:shareId" element={<PublicShare />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/trips/:id" element={<ItineraryView />} />
          <Route path="/trips/:id/view" element={<ItineraryView />} />
          <Route path="/trips/:id/edit" element={<ItineraryBuilder />} />
          <Route path="/trips/:id/itinerary" element={<ItineraryBuilder />} />
          <Route path="/trips/:id/budget" element={<Budget />} />
          <Route path="/trips/:id/timeline" element={<Timeline />} />
          <Route path="/trips/:id/share" element={<PublicShare />} />
          <Route path="/cities" element={<CitySearch />} />
          <Route path="/cities/search" element={<CitySearch />} />
          <Route path="/activities" element={<ActivitySearch />} />
          <Route path="/activities/search" element={<ActivitySearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
