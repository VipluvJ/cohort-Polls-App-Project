import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Plus, LogOut, ArrowUpRight } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------

  const handleLogout = async () => {
    try {
      await logout();

      setMobileOpen(false);

      navigate("/polls");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ------------------------------------------
  // NAVIGATION
  // ------------------------------------------

  const navigateTo = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-[var(--line)]
        bg-[var(--paper)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[72px]
          max-w-6xl
          items-center
          justify-between
          px-5
          sm:px-8
        "
      >
        {/* ========================================
            LOGO
        ========================================= */}

        <button
          type="button"
          onClick={() => navigateTo("/polls")}
          className="
            group
            flex
            items-baseline
            gap-0.5
          "
        >
          <span
            className="
              paper-heading
              text-2xl
              font-semibold
              tracking-tight
              text-[var(--ink)]
              transition
              group-hover:text-[var(--accent)]
            "
          >
            poll
          </span>

          <span
            className="
              text-2xl
              font-light
              text-[var(--accent)]
              transition
              group-hover:text-[var(--ink)]
            "
          >
            /
          </span>
        </button>

        {/* ========================================
            DESKTOP NAVIGATION
        ========================================= */}

        {!loading && (
          <nav className="hidden items-center gap-7 md:flex">
            {user ? (
              <>
                {/* --------------------------------
                    EXPLORE
                --------------------------------- */}

                <button
                  type="button"
                  onClick={() => navigateTo("/active-polls")}
                  className="
                    group
                    relative
                    text-sm
                    text-[var(--ink-soft)]
                    transition
                    hover:text-[var(--ink)]
                  "
                >
                  Explore
                  <span
                    className="
                      absolute
                      -bottom-2
                      left-0
                      h-px
                      w-0
                      bg-[var(--accent)]
                      transition-all
                      duration-200
                      group-hover:w-full
                    "
                  />
                </button>

                {/* --------------------------------
                    DASHBOARD
                --------------------------------- */}

                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard")}
                  className="
                    group
                    relative
                    text-sm
                    text-[var(--ink-soft)]
                    transition
                    hover:text-[var(--ink)]
                  "
                >
                  Dashboard
                  <span
                    className="
                      absolute
                      -bottom-2
                      left-0
                      h-px
                      w-0
                      bg-[var(--accent)]
                      transition-all
                      duration-200
                      group-hover:w-full
                    "
                  />
                </button>

                {/* --------------------------------
                    CREATE
                --------------------------------- */}

                <button
                  type="button"
                  onClick={() => navigateTo("/create-polls")}
                  className="
                    group
                    flex
                    items-center
                    gap-1.5
                    border-b
                    border-[var(--ink)]
                    pb-1
                    text-sm
                    font-medium
                    text-[var(--ink)]
                    transition
                    hover:border-[var(--accent)]
                    hover:text-[var(--accent)]
                  "
                >
                  <Plus
                    size={14}
                    strokeWidth={1.8}
                    className="
                      transition-transform
                      duration-200
                      group-hover:rotate-90
                    "
                  />
                  Create
                </button>

                {/* --------------------------------
                    SEPARATOR
                --------------------------------- */}

                <span
                  className="
                    h-5
                    w-px
                    bg-[var(--line)]
                  "
                />

                {/* --------------------------------
                    USER
                --------------------------------- */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[var(--line-dark)]
                      text-[10px]
                      font-semibold
                      uppercase
                      text-[var(--ink)]
                    "
                  >
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>

                  <span
                    className="
                      hidden
                      max-w-[120px]
                      truncate
                      text-xs
                      text-[var(--ink-soft)]
                      lg:block
                    "
                  >
                    {user?.name || user?.email || "Account"}
                  </span>
                </div>

                {/* --------------------------------
                    LOGOUT
                --------------------------------- */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    group
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-[var(--ink-faint)]
                    transition
                    hover:text-[var(--accent)]
                  "
                >
                  <LogOut
                    size={14}
                    strokeWidth={1.6}
                    className="
                      transition-transform
                      duration-200
                      group-hover:-translate-x-0.5
                    "
                  />

                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* --------------------------------
                    LOGIN
                --------------------------------- */}

                <button
                  type="button"
                  onClick={() => navigateTo("/login")}
                  className="
                    text-sm
                    text-[var(--ink-soft)]
                    transition
                    hover:text-[var(--ink)]
                  "
                >
                  Login
                </button>

                {/* --------------------------------
                    REGISTER
                --------------------------------- */}

                <button
                  type="button"
                  onClick={() => navigateTo("/register")}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    border-b
                    border-[var(--ink)]
                    pb-1
                    text-sm
                    font-medium
                    text-[var(--ink)]
                    transition
                    hover:border-[var(--accent)]
                    hover:text-[var(--accent)]
                  "
                >
                  Create account
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.7}
                    className="
                      transition-transform
                      duration-200
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </button>
              </>
            )}
          </nav>
        )}

        {/* ========================================
            MOBILE MENU BUTTON
        ========================================= */}

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            text-[var(--ink)]
            md:hidden
          "
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={21} strokeWidth={1.6} />
          ) : (
            <Menu size={21} strokeWidth={1.6} />
          )}
        </button>
      </div>

      {/* ==========================================
          MOBILE NAVIGATION
      =========================================== */}

      {!loading && mobileOpen && (
        <div
          className="
            border-t
            border-[var(--line)]
            bg-[var(--paper)]
            md:hidden
          "
        >
          <nav className="mx-auto max-w-6xl px-5 sm:px-8">
            {user ? (
              <>
                {/* EXPLORE */}

                <button
                  type="button"
                  onClick={() => navigateTo("/active-polls")}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    border-b
                    border-[var(--line)]
                    py-5
                    text-left
                    text-sm
                    text-[var(--ink)]
                  "
                >
                  <span>Explore</span>

                  <ArrowUpRight size={16} strokeWidth={1.6} />
                </button>

                {/* DASHBOARD */}

                <button
                  type="button"
                  onClick={() => navigateTo("/dashboard")}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    border-b
                    border-[var(--line)]
                    py-5
                    text-left
                    text-sm
                    text-[var(--ink)]
                  "
                >
                  <span>Dashboard</span>

                  <ArrowUpRight size={16} strokeWidth={1.6} />
                </button>

                {/* CREATE */}

                <button
                  type="button"
                  onClick={() => navigateTo("/create-polls")}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    border-b
                    border-[var(--line)]
                    py-5
                    text-left
                    text-sm
                    font-medium
                    text-[var(--ink)]
                  "
                >
                  <span className="flex items-center gap-2">
                    <Plus size={16} strokeWidth={1.7} />
                    Create a poll
                  </span>

                  <ArrowUpRight size={16} strokeWidth={1.6} />
                </button>

                {/* ACCOUNT */}

                <div className="py-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[var(--line-dark)]
                        text-xs
                        font-semibold
                        uppercase
                        text-[var(--ink)]
                      "
                    >
                      {(user?.name || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {user?.name || "Your account"}
                      </p>

                      {user?.email && (
                        <p
                          className="
                            mt-0.5
                            max-w-[220px]
                            truncate
                            text-xs
                            text-[var(--ink-faint)]
                          "
                        >
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-[var(--ink-soft)]
                      transition
                      hover:text-[var(--accent)]
                    "
                  >
                    <LogOut size={16} strokeWidth={1.6} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-7 py-6">
                <button
                  type="button"
                  onClick={() => navigateTo("/login")}
                  className="
                    text-sm
                    text-[var(--ink-soft)]
                    transition
                    hover:text-[var(--ink)]
                  "
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo("/register")}
                  className="
                    flex
                    items-center
                    gap-2
                    border-b
                    border-[var(--ink)]
                    pb-1
                    text-sm
                    font-medium
                    text-[var(--ink)]
                  "
                >
                  Create account
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
