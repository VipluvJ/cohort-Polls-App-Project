import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  // HANDLE INPUT
  // ------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------
  // HANDLE LOGIN
  // ------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        paper-texture
        min-h-[calc(100vh-72px)]
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-[calc(100vh-72px)]
          max-w-6xl
          items-center
          px-5
          py-12
          sm:px-8
          lg:grid-cols-[1fr_420px]
          lg:gap-24
          lg:py-16
        "
      >
        {/* ======================================
            LEFT SIDE
        ======================================= */}

        <section className="hidden lg:block">
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[var(--accent)]
              "
            />

            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--ink-faint)]
              "
            >
              Welcome back
            </span>
          </div>

          <h1
            className="
              paper-heading
              max-w-xl
              text-6xl
              leading-[1.02]
              tracking-tight
              text-[var(--ink)]
            "
          >
            Your voice
            <br />
            is still
            <br />
            <span className="text-[var(--accent)]">here.</span>
          </h1>

          <p
            className="
              mt-7
              max-w-md
              text-base
              leading-7
              text-[var(--ink-soft)]
            "
          >
            Sign in to create questions, cast votes, and see what everyone is
            thinking.
          </p>

          <div
            className="
              handwritten
              mt-8
              -rotate-2
              text-xl
              text-[var(--ink-soft)]
            "
          >
            pick up where you left off.
          </div>

          <div
            className="
              mt-16
              w-48
              border-t
              border-[var(--ink)]
            "
          />

          <p
            className="
              mt-4
              text-xs
              text-[var(--ink-faint)]
            "
          >
            Questions are better when people answer them.
          </p>
        </section>

        {/* ======================================
            LOGIN FORM
        ======================================= */}

        <section
          className="
            w-full
            max-w-md
            justify-self-center
            lg:justify-self-end
          "
        >
          {/* MOBILE LOGO / INTRO */}

          <div className="mb-10 lg:hidden">
            <div
              className="
                mb-5
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--ink-faint)]
              "
            >
              Welcome back
            </div>

            <h1
              className="
                paper-heading
                text-4xl
                leading-tight
                text-[var(--ink)]
              "
            >
              Sign in.
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-[var(--ink-soft)]
              "
            >
              Continue asking interesting questions.
            </p>
          </div>

          {/* FORM HEADER */}

          <div
            className="
              hidden
              border-b
              border-[var(--ink)]
              pb-5
              lg:block
            "
          >
            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--ink-faint)]
              "
            >
              Sign in
            </span>

            <h2
              className="
                paper-heading
                mt-2
                text-3xl
                text-[var(--ink)]
              "
            >
              Welcome back.
            </h2>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mt-6
                border-l-2
                border-[var(--accent)]
                bg-[var(--paper-deep)]
                px-4
                py-3
                text-sm
                leading-6
                text-[var(--ink)]
              "
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit} className="mt-8">
            {/* EMAIL */}

            <div className="mb-7">
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--ink-faint)]
                "
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="
                  w-full
                  border-0
                  border-b
                  border-[var(--line-dark)]
                  bg-transparent
                  px-0
                  py-3
                  text-base
                  text-[var(--ink)]
                  outline-none
                  placeholder:text-[var(--ink-faint)]
                  focus:border-[var(--ink)]
                "
              />
            </div>

            {/* PASSWORD */}

            <div className="mb-8">
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--ink-faint)]
                "
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="
                  w-full
                  border-0
                  border-b
                  border-[var(--line-dark)]
                  bg-transparent
                  px-0
                  py-3
                  text-base
                  text-[var(--ink)]
                  outline-none
                  placeholder:text-[var(--ink-faint)]
                  focus:border-[var(--ink)]
                "
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                w-full
                items-center
                justify-between
                border-b-2
                border-[var(--ink)]
                py-3
                text-sm
                font-semibold
                text-[var(--ink)]
                transition
                hover:border-[var(--accent)]
                hover:text-[var(--accent)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>

              {loading ? (
                <Loader2 size={17} strokeWidth={1.6} className="animate-spin" />
              ) : (
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.6}
                  className="
                    transition-transform
                    duration-200
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                />
              )}
            </button>
          </form>

          {/* REGISTER LINK */}

          <div
            className="
              mt-8
              border-t
              border-[var(--line)]
              pt-6
            "
          >
            <p
              className="
                text-sm
                text-[var(--ink-soft)]
              "
            >
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="
                group
                mt-2
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[var(--ink)]
                transition
                hover:text-[var(--accent)]
              "
            >
              Create one
              <ArrowUpRight
                size={14}
                strokeWidth={1.6}
                className="
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
