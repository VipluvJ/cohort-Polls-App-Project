import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Clock, Loader2, RefreshCw } from "lucide-react";

import { getActivePolls } from "../services/poll.service";

const ExplorePolls = () => {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------
  // FETCH ACTIVE POLLS
  // ------------------------------------------

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getActivePolls();

        console.log("ACTIVE POLLS:", response);

        setPolls(response.data);
      } catch (error) {
        console.error("Failed to fetch polls:", error.response?.data || error);

        setError(error.response?.data?.message || "Failed to load polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // ------------------------------------------
  // LOADING
  // ------------------------------------------

  if (loading) {
    return (
      <main className="paper-texture min-h-[calc(100vh-72px)]">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-5">
          <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
            <Loader2 size={17} strokeWidth={1.6} className="animate-spin" />

            <span>Finding questions...</span>
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
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-5">
          <div className="w-full max-w-md text-center">
            <div className="handwritten -rotate-2 text-2xl text-[var(--accent)]">
              something went wrong
            </div>

            <h1 className="paper-heading mt-4 text-3xl text-[var(--ink)]">
              Couldn't load the questions.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-7
                inline-flex
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
              <RefreshCw size={14} strokeWidth={1.7} />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------
  // MAIN UI
  // ------------------------------------------

  return (
    <main className="paper-texture min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        {/* ======================================
            PAGE HEADER
        ======================================= */}

        <header className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />

            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--ink-faint)]
              "
            >
              Explore
            </span>
          </div>

          <h1
            className="
              paper-heading
              max-w-3xl
              text-5xl
              leading-[1.05]
              tracking-tight
              text-[var(--ink)]
              sm:text-6xl
            "
          >
            Questions worth
            <br />
            answering.
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
            Discover what people are asking right now. Pick a question, make
            your choice, and see where everyone else stands.
          </p>

          <div
            className="
              handwritten
              mt-5
              -rotate-2
              text-xl
              text-[var(--accent)]
            "
          >
            have an opinion? good.
          </div>
        </header>

        {/* ======================================
            TOP RULE
        ======================================= */}

        <div className="border-t border-[var(--ink)]" />

        {/* ======================================
            LIST HEADER
        ======================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--line)]
            py-4
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
            Active questions
          </span>

          <span
            className="
              text-xs
              tabular-nums
              text-[var(--ink-faint)]
            "
          >
            {polls.length} {polls.length === 1 ? "question" : "questions"}
          </span>
        </div>

        {/* ======================================
            EMPTY STATE
        ======================================= */}

        {polls.length === 0 ? (
          <div className="py-24 text-center">
            <div
              className="
                handwritten
                -rotate-2
                text-2xl
                text-[var(--accent)]
              "
            >
              it's quiet here.
            </div>

            <h2
              className="
                paper-heading
                mt-4
                text-3xl
                text-[var(--ink)]
              "
            >
              No active polls.
            </h2>

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
              Check back later or be the person who starts the next
              conversation.
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
              Ask a question →
            </button>
          </div>
        ) : (
          /* ======================================
             POLL LIST
          ======================================= */

          <div>
            {polls.map((poll, index) => {
              const pollNumber = String(index + 1).padStart(2, "0");

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
                      py-8
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
                      {/* --------------------------------
                          NUMBER
                      --------------------------------- */}

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
                        {pollNumber}
                      </span>

                      {/* --------------------------------
                          CONTENT
                      --------------------------------- */}

                      <div className="min-w-0 flex-1">
                        {/* STATUS */}

                        <div
                          className="
                            mb-3
                            flex
                            flex-wrap
                            items-center
                            gap-3
                          "
                        >
                          <span
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.16em]
                              text-[var(--success)]
                            "
                          >
                            <span
                              className="
                                h-1.5
                                w-1.5
                                animate-pulse
                                rounded-full
                                bg-[var(--success)]
                              "
                            />
                            Live
                          </span>

                          <span className="text-[var(--line-dark)]">/</span>

                          <span
                            className="
                              text-[10px]
                              uppercase
                              tracking-[0.14em]
                              text-[var(--ink-faint)]
                            "
                          >
                            Question
                          </span>
                        </div>

                        {/* TITLE */}

                        <h2
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
                        </h2>

                        {/* DESCRIPTION */}

                        {poll.description && (
                          <p
                            className="
                              mt-3
                              max-w-2xl
                              text-sm
                              leading-6
                              text-[var(--ink-soft)]
                            "
                          >
                            {poll.description}
                          </p>
                        )}

                        {/* META */}

                        <div
                          className="
                            mt-5
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-2
                            text-[11px]
                            text-[var(--ink-faint)]
                          "
                        >
                          {poll.expiresAt ? (
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} strokeWidth={1.5} />
                              Ends {new Date(poll.expiresAt).toLocaleString()}
                            </span>
                          ) : (
                            <span>No expiration</span>
                          )}

                          {poll.totalVotes !== undefined && (
                            <>
                              <span>•</span>

                              <span>
                                {poll.totalVotes}{" "}
                                {poll.totalVotes === 1
                                  ? "response"
                                  : "responses"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* --------------------------------
                          ARROW
                      --------------------------------- */}

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

        {/* ======================================
            FOOTER NOTE
        ======================================= */}

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
            <span>Pick a question and make your voice count.</span>

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
              ask your own →
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ExplorePolls;
