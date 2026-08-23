import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/polls");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => navigate("/polls")}
          className="text-xl font-bold text-white"
        >
          Polls
        </button>

        {/* Prevent auth buttons from flashing while checking session */}
        {!loading && (
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/active-polls")}
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Explore
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/create-polls")}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
                >
                  + Create Poll
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
                >
                  Create Account
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
