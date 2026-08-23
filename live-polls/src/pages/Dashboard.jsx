import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/poll.service.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await getDashboard();

        console.log("DASHBOARD RESPONSE:", response);

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard fetch failed:", error.response?.data || error);

        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400">
        {error}
      </div>
    );
  }

  const { stats, polls } = dashboard;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Poll Dashboard</h1>

            <p className="text-sm text-zinc-500">Manage your polls</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:block">
              {user?.name || user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <p className="text-sm text-zinc-500">Welcome back</p>

          <h2 className="mt-1 text-3xl font-bold">{user?.name || "User"} 👋</h2>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Polls" value={stats.totalPolls} />

          <StatCard title="Active Polls" value={stats.activePolls} />

          <StatCard title="Total Votes" value={stats.totalVotes} />

          <StatCard title="Closed Polls" value={stats.closedPolls} />
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">My Polls</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Polls created by you.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              + Create Poll
            </button>
          </div>

          {polls.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-12 text-center">
              <p className="text-lg font-medium">No polls yet</p>

              <p className="mt-2 text-sm text-zinc-500">
                Create your first poll to start collecting votes.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-900"
              >
                Create your first poll
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
                >
                  <div>
                    <h4 className="font-medium">{poll.title}</h4>

                    <p className="mt-1 text-sm text-zinc-500">
                      {poll.isActive ? "Active" : "Closed"}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/${poll.id}`)}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <p className="text-sm text-zinc-500">{title}</p>

      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
};

export default Dashboard;
