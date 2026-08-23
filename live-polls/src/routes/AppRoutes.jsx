import { Routes, Route } from "react-router-dom";

import CreatePoll from "../pages/CreatePoll";
import PollDetails from "../pages/PollDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ExplorePolls from "../pages/ExplorePolls";
import Header from "../components/ui/Header";

import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <>
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/create-polls" element={<CreatePoll />} />

        <Route path="/active-polls" element={<ExplorePolls />} />

        <Route path="/:pollId" element={<PollDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
