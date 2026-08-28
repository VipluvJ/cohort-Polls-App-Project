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

  // =====================================================
  // 1. POLL STATE
  // Static information about the poll
  // =====================================================

  const [poll, setPoll] = useState(null);

  // =====================================================
  // 2. RESULTS STATE
  // Dynamic information that changes after votes
  // =====================================================

  const [results, setResults] = useState(null);

  // =====================================================
  // 3. VOTING STATE
  // =====================================================

  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  // =====================================================
  // 4. GENERAL STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // 5. FETCH POLL DETAILS
  // =====================================================

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPoll(pollId);

        console.log("POLL RESPONSE:", response);

        // Supports either:
        // { success, message, data }
        // OR direct data
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

  // =====================================================
  // 6. FETCH INITIAL RESULTS
  // This gives percentages before any socket update arrives
  // =====================================================

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getPollResults(pollId);

        console.log("INITIAL RESULTS:", response);

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

  // =====================================================
  // 7. SOCKET.IO LIVE RESULTS
  // =====================================================

  useEffect(() => {
    if (!pollId) return;

    const joinPollRoom = () => {
      console.log("🟢 SOCKET CONNECTED:", socket.id);

      socket.emit("join-poll", pollId);

      console.log("🟢 JOINED POLL:", pollId);
    };

    const handlePollUpdated = (updatedResults) => {
      console.log("🔥 POLL UPDATED RECEIVED:", updatedResults);

      // Only results change.
      // Poll data stays separate.
      setResults(updatedResults);
    };

    socket.on("connect", joinPollRoom);
    socket.on("pollUpdated", handlePollUpdated);

    // Connect if not already connected
    socket.connect();

    // If socket was already connected before this page opened,
    // the "connect" event may not fire again.
    if (socket.connected) {
      socket.emit("join-poll", pollId);

      console.log("🟢 SOCKET ALREADY CONNECTED. JOINED POLL:", pollId);
    }

    return () => {
      socket.off("connect", joinPollRoom);
      socket.off("pollUpdated", handlePollUpdated);

      // We remove listeners, but don't disconnect the global
      // socket instance unnecessarily.
    };
  }, [pollId]);

  // =====================================================
  // 8. SELECT OPTION
  // =====================================================

  const handleOptionSelect = (optionId) => {
    // Don't allow changing the selection while submitting,
    // after successful voting, or when poll is closed.
    if (voting || voteSuccess || pollClosed) {
      return;
    }

    setSelectedOption(optionId);
    setError("");
  };

  // =====================================================
  // 9. SUBMIT VOTE
  // =====================================================

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Please select an option before voting.");
      return;
    }

    try {
      setVoting(true);
      setError("");

      console.log("Submitting vote:", {
        pollId,
        optionId: selectedOption,
      });

      // -------------------------------------------------
      // A. Submit vote through REST API
      // -------------------------------------------------

      const voteResponse = await voteOnPoll(pollId, selectedOption);

      console.log("Vote submitted:", voteResponse);

      // -------------------------------------------------
      // B. Fetch latest results immediately
      //
      // Socket.IO should also send these results, but this
      // guarantees that the voter sees the update immediately.
      // -------------------------------------------------

      const resultsResponse = await getPollResults(pollId);

      console.log("Latest results after vote:", resultsResponse);

      const latestResults = resultsResponse?.data ?? resultsResponse;

      setResults(latestResults);

      // -------------------------------------------------
      // C. Show success
      // -------------------------------------------------

      setVoteSuccess(true);
    } catch (error) {
      console.error("Vote failed:", error.response?.data || error);

      // -------------------------------------------------
      // Duplicate vote
      // -------------------------------------------------

      if (error.response?.status === 409) {
        setError(
          error.response?.data?.message ||
            "You have already voted on this poll.",
        );

        // Still fetch the latest results because the user
        // should be able to see current live percentages.
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

  // =====================================================
  // 10. LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 size={22} className="animate-spin" />

          <span>Loading poll...</span>
        </div>
      </main>
    );
  }

  // =====================================================
  // 11. POLL NOT FOUND / ERROR
  // =====================================================

  if (!poll) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-red-400" />

          <h1 className="mt-4 text-xl font-semibold">Poll not found</h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {error || "This poll does not exist."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Explore Polls
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // 12. POLL STATUS
  // =====================================================

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) <= new Date();

  const isInactive = poll.isActive === false;

  const pollClosed = isExpired || isInactive;

  // =====================================================
  // 13. OPTIONS
  //
  // Use results.options because it contains:
  // id, text, votes, percentage
  //
  // Fall back to poll.options while results load.
  // =====================================================

  const pollOptions = results?.options || poll.options || [];

  const totalVotes = results?.totalVotes ?? poll.totalVotes ?? 0;

  // =====================================================
  // 14. UI
  // =====================================================

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* ==============================================
            BACK BUTTON
        ============================================== */}

        <button
          type="button"
          onClick={() => navigate("/explore")}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Explore
        </button>

        {/* ==============================================
            POLL HEADER
        ============================================== */}

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Vote size={16} />
            Live Poll
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {poll.title}
          </h1>

          {poll.description && (
            <p className="mt-4 max-w-2xl leading-relaxed text-zinc-400">
              {poll.description}
            </p>
          )}
        </div>

        {/* ==============================================
            MAIN POLL CARD
        ============================================== */}

        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          {/* ============================================
              STATUS SECTION
          ============================================ */}

          <div className="border-b border-zinc-800 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Status */}
              <div className="flex flex-wrap items-center gap-3">
                {!pollClosed ? (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                    Closed
                  </span>
                )}

                {/* Expiration */}
                {poll.expiresAt && (
                  <span
                    className={`flex items-center gap-2 text-sm ${
                      isExpired ? "text-red-400" : "text-zinc-500"
                    }`}
                  >
                    <Clock size={16} />

                    {isExpired
                      ? "Poll expired"
                      : `Ends ${new Date(poll.expiresAt).toLocaleString()}`}
                  </span>
                )}
              </div>

              {/* Total votes */}
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Total votes
                </p>

                <p className="mt-1 text-xl font-bold">{totalVotes}</p>
              </div>
            </div>

            {/* Closed messages */}

            {isExpired && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                This poll has expired. You can still view the final results.
              </div>
            )}

            {isInactive && !isExpired && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                This poll is no longer active. You can still view the results.
              </div>
            )}
          </div>

          {/* ============================================
              VOTING / RESULTS SECTION
          ============================================ */}

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Choose your answer</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Select one option. Results update live as people vote.
                </p>
              </div>

              {/* Live indicator */}

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live
              </div>
            </div>

            {/* ==========================================
                OPTIONS
            ========================================== */}

            <div className="space-y-3">
              {pollOptions.map((option, index) => {
                const selected = selectedOption === option.id;

                // Backend already calculates percentage.
                // Convert safely to a number for CSS.
                const percentage = Number(option.percentage) || 0;

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={voting || voteSuccess || pollClosed}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`
                      group
                      relative
                      w-full
                      overflow-hidden
                      rounded-2xl
                      border
                      text-left
                      transition-all
                      duration-200

                      ${
                        selected
                          ? "border-violet-500"
                          : "border-zinc-800 hover:border-zinc-600"
                      }

                      ${
                        voting || voteSuccess || pollClosed
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    {/* ==================================
                        ANIMATED PERCENTAGE BAR

                        When `results` changes:

                        40% → 45%

                        React changes width and Tailwind
                        animates it automatically.
                    ================================== */}

                    <div
                      className="
                        absolute
                        inset-y-0
                        left-0
                        bg-violet-500/15
                        transition-all
                        duration-700
                        ease-out
                      "
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                    {/* ==================================
                        OPTION CONTENT
                    ================================== */}

                    <div className="relative z-10 flex items-center justify-between gap-4 p-4 sm:p-5">
                      {/* Left side */}

                      <div className="flex min-w-0 items-center gap-4">
                        {/* Number / selected indicator */}

                        <span
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            text-sm
                            font-medium
                            transition

                            ${
                              selected
                                ? "border-violet-500 bg-violet-500 text-white"
                                : "border-zinc-700 bg-zinc-950 text-zinc-400"
                            }
                          `}
                        >
                          {selected ? <Check size={17} /> : index + 1}
                        </span>

                        {/* Text */}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-100">
                            {option.text}
                          </p>

                          {results && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {option.votes ?? 0}{" "}
                              {(option.votes ?? 0) === 1 ? "vote" : "votes"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right side */}

                      <div className="flex shrink-0 items-center gap-3">
                        {/* Percentage */}

                        {results && (
                          <span className="text-sm font-semibold tabular-nums text-zinc-100">
                            {percentage}%
                          </span>
                        )}

                        {/* Radio indicator */}

                        <span
                          className={`
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            transition

                            ${
                              selected ? "border-violet-400" : "border-zinc-600"
                            }
                          `}
                        >
                          {selected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

            {error && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={18} className="shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {voteSuccess && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />

                <div>
                  <p className="font-medium text-emerald-400">
                    Vote submitted successfully!
                  </p>

                  <p className="mt-1 text-sm text-emerald-400/70">
                    Results will continue updating live.
                  </p>
                </div>
              </div>
            )}

            {/* ==========================================
                SUBMIT BUTTON
            ========================================== */}

            <button
              type="button"
              onClick={handleVote}
              disabled={!selectedOption || voting || voteSuccess || pollClosed}
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-violet-600
                px-5
                py-4
                font-semibold
                text-white
                transition
                hover:bg-violet-500
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {voting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting vote...
                </>
              ) : voteSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  Vote Submitted
                </>
              ) : pollClosed ? (
                <>
                  <Clock size={20} />
                  Poll Closed
                </>
              ) : (
                <>
                  <Vote size={20} />
                  Submit Vote
                </>
              )}
            </button>
          </div>

          {/* ============================================
              FOOTER
          ============================================ */}

          <div className="border-t border-zinc-800 bg-zinc-950/30 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
              <span>One vote allowed per anonymous browser session.</span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Live results enabled
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
