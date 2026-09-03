import { Routes, Route } from "react-router-dom";

import CreatePoll from "../pages/CreatePoll";
import PollDetails from "../pages/PollDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ExplorePolls from "../pages/ExplorePolls";

import Header from "../components/ui/Header";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";

const AppRoutes = () => {
  return (
    <>
      <Header />

      <Routes>
        {/* Public */}

        <Route path="/active-polls" element={<ExplorePolls />} />

        <Route path="/:pollId" element={<PollDetails />} />

        {/* Guest-only routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-polls"
          element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
