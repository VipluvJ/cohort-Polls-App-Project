import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
  // HANDLE REGISTER
  // ------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(formData);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
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
          lg:grid-cols-[420px_1fr]
          lg:gap-24
          lg:py-16
        "
      >
        {/* ======================================
            REGISTER FORM
        ======================================= */}

        <section
          className="
            order-2
            w-full
            max-w-md
            justify-self-center
            lg:order-1
            lg:justify-self-start
          "
        >
          {/* MOBILE INTRO */}

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
              New here?
            </div>

            <h1
              className="
                paper-heading
                text-4xl
                leading-tight
                text-[var(--ink)]
              "
            >
              Create an account.
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-[var(--ink-soft)]
              "
            >
              Start asking questions and collecting opinions.
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
              Get started
            </span>

            <h2
              className="
                paper-heading
                mt-2
                text-3xl
                text-[var(--ink)]
              "
            >
              Create your account.
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
            {/* USERNAME */}

            <div className="mb-7">
              <label
                htmlFor="name"
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
                Username
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="What should we call you?"
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
                autoComplete="new-password"
                placeholder="Create a password"
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
              <span>{loading ? "Creating account..." : "Create account"}</span>

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

          {/* LOGIN LINK */}

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
              Already have an account?
            </p>

            <Link
              to="/login"
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
              Sign in
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

        {/* ======================================
            RIGHT SIDE
        ======================================= */}

        <section
          className="
            order-1
            hidden
            lg:order-2
            lg:block
          "
        >
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
                bg-[var(--success)]
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
              Join the conversation
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
            Every good
            <br />
            question
            <br />
            <span className="text-[var(--accent)]">starts somewhere.</span>
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
            Create your account and put your questions out there. Let people
            vote, disagree, and surprise you.
          </p>

          <div
            className="
              handwritten
              mt-8
              rotate-2
              text-xl
              text-[var(--accent)]
            "
          >
            ask something worth answering.
          </div>

          <div
            className="
              mt-16
              w-48
              border-t
              border-[var(--ink)]
            "
          />

          <div className="mt-4 flex gap-8">
            <div>
              <p
                className="
                  text-2xl
                  font-medium
                  text-[var(--ink)]
                "
              >
                01
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-[var(--ink-faint)]
                "
              >
                Ask
              </p>
            </div>

            <div>
              <p
                className="
                  text-2xl
                  font-medium
                  text-[var(--ink)]
                "
              >
                02
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-[var(--ink-faint)]
                "
              >
                Vote
              </p>
            </div>

            <div>
              <p
                className="
                  text-2xl
                  font-medium
                  text-[var(--ink)]
                "
              >
                03
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-[var(--ink-faint)]
                "
              >
                Discover
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
