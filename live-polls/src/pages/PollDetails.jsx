import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Vote,
} from "lucide-react";

import { getPoll, getPollResults, voteOnPoll } from "../services/poll.service";

import socket from "../services/socket";

export default function PollDetails() {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);

  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------
  // FETCH POLL
  // ------------------------------------------

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPoll(pollId);
        const pollData = response?.data ?? response;

        setPoll(pollData);
      } catch (error) {
        console.error("Failed to fetch poll:", error.response?.data || error);

        setError(error.response?.data?.message || "Unable to load this poll.");
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  // ------------------------------------------
  // FETCH RESULTS
  // ------------------------------------------

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getPollResults(pollId);
        const resultData = response?.data ?? response;

        setResults(resultData);
      } catch (error) {
        console.error(
          "Failed to fetch results:",
          error.response?.data || error,
        );
      }
    };

    if (pollId) {
      fetchResults();
    }
  }, [pollId]);

  // ------------------------------------------
  // SOCKET.IO
  // ------------------------------------------

  useEffect(() => {
    if (!pollId) return;

    const joinPollRoom = () => {
      console.log("🟢 SOCKET CONNECTED:", socket.id);

      socket.emit("join-poll", pollId);

      console.log("🟢 JOINED POLL:", pollId);
    };

    const handlePollUpdated = (updatedResults) => {
      console.log("🔥 POLL UPDATED RECEIVED:", updatedResults);

      setResults(updatedResults);
    };

    socket.on("connect", joinPollRoom);
    socket.on("pollUpdated", handlePollUpdated);

    socket.connect();

    if (socket.connected) {
      socket.emit("join-poll", pollId);

      console.log("🟢 SOCKET ALREADY CONNECTED:", pollId);
    }

    return () => {
      socket.off("connect", joinPollRoom);
      socket.off("pollUpdated", handlePollUpdated);
    };
  }, [pollId]);

  // ------------------------------------------
  // POLL STATUS
  // ------------------------------------------

  const isExpired = poll?.expiresAt && new Date(poll.expiresAt) <= new Date();

  const isInactive = poll?.isActive === false;

  const pollClosed = isExpired || isInactive;

  // ------------------------------------------
  // SELECT OPTION
  // ------------------------------------------

  const handleOptionSelect = (optionId) => {
    if (voting || voteSuccess || pollClosed) {
      return;
    }

    setSelectedOption(optionId);
    setError("");
  };

  // ------------------------------------------
  // SUBMIT VOTE
  // ------------------------------------------

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Choose an answer first.");
      return;
    }

    try {
      setVoting(true);
      setError("");

      await voteOnPoll(pollId, selectedOption);

      const resultsResponse = await getPollResults(pollId);

      const latestResults = resultsResponse?.data ?? resultsResponse;

      setResults(latestResults);
      setVoteSuccess(true);
    } catch (error) {
      console.error("Vote failed:", error.response?.data || error);

      if (error.response?.status === 409) {
        setError(
          error.response?.data?.message ||
            "You have already voted on this poll.",
        );

        try {
          const resultsResponse = await getPollResults(pollId);

          const latestResults = resultsResponse?.data ?? resultsResponse;

          setResults(latestResults);
        } catch (resultError) {
          console.error("Failed to fetch latest results:", resultError);
        }
      } else {
        setError(
          error.response?.data?.message || "Failed to submit your vote.",
        );
      }
    } finally {
      setVoting(false);
    }
  };

  // ------------------------------------------
  // LOADING
  // ------------------------------------------

  if (loading) {
    return (
      <main className="paper-texture flex min-h-[calc(100vh-72px)] items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
          <Loader2 size={18} className="animate-spin" />

          <span>Loading question...</span>
        </div>
      </main>
    );
  }

  // ------------------------------------------
  // NOT FOUND
  // ------------------------------------------

  if (!poll) {
    return (
      <main className="paper-texture flex min-h-[calc(100vh-72px)] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <AlertCircle
            size={36}
            strokeWidth={1.4}
            className="mx-auto text-[var(--ink-soft)]"
          />

          <h1 className="paper-heading mt-5 text-3xl">Poll not found.</h1>

          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
            {error || "This question doesn't exist anymore."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/active-polls")}
            className="
              mt-7
              border-b
              border-[var(--ink)]
              pb-1
              text-sm
              font-medium
              transition
              hover:border-[var(--accent)]
              hover:text-[var(--accent)]
            "
          >
            Explore questions →
          </button>
        </div>
      </main>
    );
  }

  // ------------------------------------------
  // DATA
  // ------------------------------------------

  const pollOptions = results?.options || poll.options || [];

  const totalVotes = results?.totalVotes ?? poll.totalVotes ?? 0;

  return (
    <main className="paper-texture ink-appear">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-14">
        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/active-polls")}
          className="
            group
            mb-14
            flex
            items-center
            gap-2
            text-sm
            text-[var(--ink-soft)]
            transition
            hover:text-[var(--ink)]
          "
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.7}
            className="
              transition
              group-hover:-translate-x-1
            "
          />

          <span>Back to explore</span>
        </button>

        {/* HEADER */}

        <header className="mb-14">
          <div className="mb-5 flex flex-wrap items-center gap-4">
            {!pollClosed ? (
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--success)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" />
                Live poll
              </span>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Poll closed
              </span>
            )}

            <span className="text-[var(--line-dark)]">/</span>

            <span className="text-xs text-[var(--ink-faint)]">
              {totalVotes} {totalVotes === 1 ? "response" : "responses"}
            </span>
          </div>

          <h1
            className="
              paper-heading
              max-w-3xl
              text-5xl
              leading-[1.02]
              sm:text-6xl
            "
          >
            {poll.title}
          </h1>

          {poll.description && (
            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-7
                text-[var(--ink-soft)]
                sm:text-lg
              "
            >
              {poll.description}
            </p>
          )}

          {!pollClosed && (
            <div
              className="
                handwritten
                mt-5
                -rotate-2
                text-2xl
                text-[var(--accent)]
              "
            >
              what do you think?
            </div>
          )}
        </header>

        {/* POLL */}

        <section>
          <div className="border-t border-[var(--ink)]" />

          {/* STATUS */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-[var(--line)]
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              {!pollClosed ? (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--success)]" />

                  <span className="text-xs text-[var(--ink-soft)]">
                    Results update live
                  </span>
                </>
              ) : (
                <>
                  <Clock
                    size={15}
                    strokeWidth={1.6}
                    className="text-[var(--ink-soft)]"
                  />

                  <span className="text-xs text-[var(--ink-soft)]">
                    Final results
                  </span>
                </>
              )}
            </div>

            {poll.expiresAt && (
              <span className="text-xs text-[var(--ink-faint)]">
                {isExpired
                  ? "Closed"
                  : `Ends ${new Date(poll.expiresAt).toLocaleString()}`}
              </span>
            )}
          </div>

          {/* CLOSED MESSAGE */}

          {pollClosed && (
            <div
              className="
                border-b
                border-[var(--line)]
                py-5
                text-sm
                text-[var(--ink-soft)]
              "
            >
              {isExpired
                ? "This poll has expired. These are the final results."
                : "This poll is no longer active. These are the current results."}
            </div>
          )}

          {/* ANSWERS */}

          <div className="py-7">
            <div
              className="
                mb-8
                flex
                items-end
                justify-between
                gap-4
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
                  Your answer
                </div>

                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  Choose one.
                </p>
              </div>

              {!voteSuccess && !pollClosed && (
                <span
                  className="
                    hidden
                    text-xs
                    text-[var(--ink-faint)]
                    sm:block
                  "
                >
                  one response
                </span>
              )}
            </div>

            {/* OPTIONS */}

            <div>
              {pollOptions.map((option, index) => {
                const selected = selectedOption === option.id;

                const percentage = Number(option.percentage) || 0;

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={voting || voteSuccess || pollClosed}
                    onClick={() => handleOptionSelect(option.id)}
                    className="
                      group
                      relative
                      block
                      w-full
                      border-b
                      border-[var(--line)]
                      py-6
                      text-left
                      transition
                      first:border-t
                      disabled:cursor-not-allowed
                    "
                  >
                    {/* OPTION */}

                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-start
                        gap-5
                      "
                    >
                      {/* NUMBER */}

                      <span
                        className="
                          w-8
                          shrink-0
                          pt-1
                          text-xs
                          font-medium
                          tabular-nums
                          text-[var(--ink-faint)]
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* ANSWER */}

                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-5
                          "
                        >
                          <span
                            className={`
                              text-base
                              transition
                              sm:text-lg
                              ${
                                selected
                                  ? "font-semibold text-[var(--ink)]"
                                  : "text-[var(--ink)]"
                              }
                            `}
                          >
                            {option.text}
                          </span>

                          {results && (
                            <span
                              className="
                                shrink-0
                                text-sm
                                font-medium
                                tabular-nums
                                text-[var(--ink-soft)]
                              "
                            >
                              {percentage}%
                            </span>
                          )}
                        </div>

                        {/* RESULT BAR */}

                        {results && (
                          <div
                            className="
                              mt-4
                              h-[3px]
                              w-full
                              overflow-hidden
                              bg-[var(--paper-deep)]
                            "
                          >
                            <div
                              className="
                                h-full
                                origin-left
                                bg-[var(--ink)]
                                transition-all
                                duration-700
                                ease-out
                              "
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        )}

                        {/* VOTE COUNT */}

                        {results && (
                          <div
                            className="
                              mt-2
                              text-[11px]
                              text-[var(--ink-faint)]
                            "
                          >
                            {option.votes ?? 0}{" "}
                            {(option.votes ?? 0) === 1 ? "vote" : "votes"}
                          </div>
                        )}
                      </div>

                      {/* SELECTION */}

                      <span
                        className="
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          pt-1
                        "
                      >
                        {selected ? (
                          <span
                            className="
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-full
                              bg-[var(--ink)]
                              text-[var(--paper)]
                            "
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </span>
                        ) : (
                          <span
                            className="
                              h-4
                              w-4
                              rounded-full
                              border
                              border-[var(--line-dark)]
                              transition
                              group-hover:border-[var(--ink)]
                            "
                          />
                        )}
                      </span>
                    </div>

                    {/* SELECTED ACCENT */}

                    {selected && (
                      <div
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-[2px]
                          w-16
                          bg-[var(--accent)]
                        "
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-6
                  flex
                  items-start
                  gap-3
                  border-l-2
                  border-red-700
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-800
                "
              >
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                  strokeWidth={1.7}
                />

                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}

            {voteSuccess && (
              <div
                className="
                  mt-8
                  border-y
                  border-[var(--line)]
                  py-5
                "
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    strokeWidth={1.6}
                    className="
                      mt-0.5
                      shrink-0
                      text-[var(--success)]
                    "
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Your vote has been counted.
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-[var(--ink-soft)]
                      "
                    >
                      Results will continue updating as other people vote.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VOTE BUTTON */}

            {!pollClosed && !voteSuccess && (
              <div
                className="
                  mt-8
                  flex
                  flex-col
                  items-start
                  gap-3
                  sm:flex-row
                  sm:items-center
                "
              >
                <button
                  type="button"
                  onClick={handleVote}
                  disabled={!selectedOption || voting}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    border-b-2
                    border-[var(--ink)]
                    pb-2
                    text-sm
                    font-semibold
                    transition
                    hover:border-[var(--accent)]
                    hover:text-[var(--accent)]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  {voting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />

                      <span>Counting your vote...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit vote</span>

                      <Vote
                        size={16}
                        strokeWidth={1.7}
                        className="
                          transition
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}
                </button>

                <span
                  className="
                    text-xs
                    text-[var(--ink-faint)]
                  "
                >
                  You can change your answer before submitting.
                </span>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div
            className="
              border-t
              border-[var(--line)]
              py-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-2
                text-[11px]
                text-[var(--ink-faint)]
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <span>One vote per anonymous browser session.</span>

              {!pollClosed && (
                <span
                  className="
                    handwritten
                    text-lg
                    text-[var(--ink-soft)]
                  "
                >
                  watching the ink move ✎
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
