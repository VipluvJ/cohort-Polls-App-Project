import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Vote,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/poll.service.js";

const Dashboard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------
  // FETCH DASHBOARD
  // ------------------------------------------

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

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

  // ------------------------------------------
  // LOADING
  // ------------------------------------------

  if (loading) {
    return (
      <main className="paper-texture min-h-[calc(100vh-72px)]">
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
          <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
            <Loader2 size={17} strokeWidth={1.6} className="animate-spin" />

            <span>Opening your notebook...</span>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------
  // ERROR
  // ------------------------------------------

  if (error) {
    return (
      <main className="paper-texture min-h-[calc(100vh-72px)]">
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
          <div className="w-full max-w-md text-center">
            <div
              className="
                handwritten
                -rotate-2
                text-2xl
                text-[var(--accent)]
              "
            >
              something went wrong
            </div>

            <h1
              className="
                paper-heading
                mt-4
                text-3xl
                text-[var(--ink)]
              "
            >
              Your dashboard is unavailable.
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-[var(--ink-soft)]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-7
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
              Try again →
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------
  // DATA
  // ------------------------------------------

  const { stats, polls } = dashboard;

  return (
    <main className="paper-texture min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        {/* ======================================
            INTRO
        ======================================= */}

        <header className="mb-14">
          <div
            className="
              mb-5
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
              Your notebook
            </span>
          </div>

          <h1
            className="
              paper-heading
              max-w-3xl
              text-5xl
              leading-[1.03]
              tracking-tight
              text-[var(--ink)]
              sm:text-6xl
            "
          >
            Welcome back,
            <br />
            <span className="text-[var(--accent)]">
              {user?.name || "User"}.
            </span>
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              text-base
              leading-7
              text-[var(--ink-soft)]
              sm:text-lg
            "
          >
            Here's a look at the questions you've put into the world.
          </p>

          <div
            className="
              handwritten
              mt-5
              -rotate-2
              text-xl
              text-[var(--ink-soft)]
            "
          >
            keep asking interesting questions ✎
          </div>
        </header>

        {/* ======================================
            STATS
        ======================================= */}

        <section>
          <div
            className="
              border-t
              border-[var(--ink)]
            "
          />

          <div
            className="
              grid
              grid-cols-2
              divide-x
              divide-[var(--line)]
              border-b
              border-[var(--line)]
              sm:grid-cols-4
            "
          >
            <StatItem label="Total polls" value={stats.totalPolls} />

            <StatItem label="Active" value={stats.activePolls} accent />

            <StatItem label="Total votes" value={stats.totalVotes} />

            <StatItem label="Closed" value={stats.closedPolls} />
          </div>
        </section>

        {/* ======================================
            MY POLLS HEADER
        ======================================= */}

        <section className="mt-14">
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--ink-faint)]
                "
              >
                Your questions
              </div>

              <h2
                className="
                  paper-heading
                  mt-2
                  text-3xl
                  text-[var(--ink)]
                "
              >
                My polls
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-[var(--ink-soft)]
                "
              >
                Questions created by you.
              </p>
            </div>

            {/* CREATE */}

            <button
              type="button"
              onClick={() => navigate("/create-polls")}
              className="
                group
                flex
                w-fit
                items-center
                gap-2
                border-b-2
                border-[var(--ink)]
                pb-2
                text-sm
                font-semibold
                text-[var(--ink)]
                transition
                hover:border-[var(--accent)]
                hover:text-[var(--accent)]
              "
            >
              <Plus
                size={16}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-200
                  group-hover:rotate-90
                "
              />
              Create poll
            </button>
          </div>

          {/* ====================================
              EMPTY STATE
          ===================================== */}

          {polls.length === 0 ? (
            <div
              className="
                mt-8
                border-y
                border-[var(--line)]
                py-20
                text-center
              "
            >
              <div
                className="
                  handwritten
                  -rotate-2
                  text-2xl
                  text-[var(--accent)]
                "
              >
                blank page.
              </div>

              <h3
                className="
                  paper-heading
                  mt-4
                  text-3xl
                  text-[var(--ink)]
                "
              >
                You haven't created a poll yet.
              </h3>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-[var(--ink-soft)]
                "
              >
                Start a question, share it with people, and watch the answers
                come in.
              </p>

              <button
                type="button"
                onClick={() => navigate("/create-polls")}
                className="
                  mt-7
                  border-b-2
                  border-[var(--ink)]
                  pb-2
                  text-sm
                  font-semibold
                  text-[var(--ink)]
                  transition
                  hover:border-[var(--accent)]
                  hover:text-[var(--accent)]
                "
              >
                Create your first poll →
              </button>
            </div>
          ) : (
            /* ====================================
               POLL LIST
            ===================================== */

            <div
              className="
                mt-8
                border-t
                border-[var(--ink)]
              "
            >
              {polls.map((poll, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <article
                    key={poll.id}
                    className="
                      group
                      border-b
                      border-[var(--line)]
                    "
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/${poll.id}`)}
                      className="
                        block
                        w-full
                        py-7
                        text-left
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          gap-5
                          sm:gap-7
                        "
                      >
                        {/* NUMBER */}

                        <span
                          className="
                            w-7
                            shrink-0
                            pt-1
                            text-xs
                            font-medium
                            tabular-nums
                            text-[var(--ink-faint)]
                          "
                        >
                          {number}
                        </span>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                          {/* STATUS */}

                          <div
                            className="
                              mb-3
                              flex
                              items-center
                              gap-3
                            "
                          >
                            {poll.isActive ? (
                              <>
                                <span
                                  className="
                                    h-1.5
                                    w-1.5
                                    animate-pulse
                                    rounded-full
                                    bg-[var(--success)]
                                  "
                                />

                                <span
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[var(--success)]
                                  "
                                >
                                  Active
                                </span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2
                                  size={13}
                                  strokeWidth={1.5}
                                  className="
                                    text-[var(--ink-faint)]
                                  "
                                />

                                <span
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[var(--ink-faint)]
                                  "
                                >
                                  Closed
                                </span>
                              </>
                            )}
                          </div>

                          {/* TITLE */}

                          <h3
                            className="
                              paper-heading
                              max-w-3xl
                              text-2xl
                              leading-tight
                              text-[var(--ink)]
                              transition-colors
                              duration-200
                              group-hover:text-[var(--accent)]
                              sm:text-3xl
                            "
                          >
                            {poll.title}
                          </h3>

                          {/* META */}

                          <div
                            className="
                              mt-4
                              flex
                              flex-wrap
                              items-center
                              gap-x-4
                              gap-y-2
                              text-[11px]
                              text-[var(--ink-faint)]
                            "
                          >
                            {poll.totalVotes !== undefined && (
                              <span className="flex items-center gap-1.5">
                                <Vote size={13} strokeWidth={1.5} />
                                {poll.totalVotes}{" "}
                                {poll.totalVotes === 1
                                  ? "response"
                                  : "responses"}
                              </span>
                            )}

                            {poll.expiresAt && (
                              <>
                                <span>•</span>

                                <span className="flex items-center gap-1.5">
                                  <Clock size={13} strokeWidth={1.5} />

                                  {poll.isActive
                                    ? `Ends ${new Date(
                                        poll.expiresAt,
                                      ).toLocaleDateString()}`
                                    : "Expired"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* ARROW */}

                        <span
                          className="
                            mt-1
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            text-[var(--ink-faint)]
                            transition-all
                            duration-200
                            group-hover:-translate-y-1
                            group-hover:translate-x-1
                            group-hover:text-[var(--ink)]
                          "
                        >
                          <ArrowUpRight size={19} strokeWidth={1.5} />
                        </span>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {/* ====================================
              BOTTOM NOTE
          ===================================== */}

          {polls.length > 0 && (
            <div
              className="
                flex
                flex-col
                gap-3
                py-8
                text-[11px]
                text-[var(--ink-faint)]
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <span>
                {polls.length} {polls.length === 1 ? "question" : "questions"}{" "}
                in your notebook.
              </span>

              <button
                type="button"
                onClick={() => navigate("/create-polls")}
                className="
                  handwritten
                  text-lg
                  text-[var(--ink-soft)]
                  transition
                  hover:text-[var(--accent)]
                "
              >
                ask another →
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

// ==========================================
// STAT ITEM
// ==========================================

const StatItem = ({ label, value, accent = false }) => {
  return (
    <div
      className="
        px-4
        py-6
        first:pl-0
        sm:px-6
        sm:py-7
      "
    >
      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-[var(--ink-faint)]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-2
          text-3xl
          font-medium
          tabular-nums
          tracking-tight
          ${accent ? "text-[var(--success)]" : "text-[var(--ink)]"}
        `}
      >
        {value}
      </p>
    </div>
  );
};

export default Dashboard;
