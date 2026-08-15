import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Loader2, Vote } from "lucide-react";

import { getPoll, getPollResults, voteOnPoll } from "../services/poll.service";

import socket from "../services/socket";

export default function PollDetails() {
  const { pollId } = useParams();

  // -----------------------------
  // Poll state
  // -----------------------------

  const [poll, setPoll] = useState(null);

  // -----------------------------
  // Results state
  // -----------------------------

  const [results, setResults] = useState(null);

  // -----------------------------
  // Voting state
  // -----------------------------

  const [selectedOption, setSelectedOption] = useState(null);

  const [voting, setVoting] = useState(false);

  const [voteSuccess, setVoteSuccess] = useState(false);

  // -----------------------------
  // General state
  // -----------------------------

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // 1. Fetch poll
  // =====================================================

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPoll(pollId);

        console.log("POLL RESPONSE:", response);

        const pollData = response?.data ?? response;

        setPoll(pollData);
      } catch (error) {
        console.error("Failed to fetch poll:", error);

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
  // 2. Fetch initial results
  // =====================================================

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getPollResults(pollId);

        console.log("INITIAL RESULTS:", response);

        const resultData = response?.data ?? response;

        setResults(resultData);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      }
    };

    if (pollId) {
      fetchResults();
    }
  }, [pollId]);

  // =====================================================
  // 3. Socket.IO
  // =====================================================

  useEffect(() => {
    if (!pollId) return;

    const handleConnect = () => {
      console.log("🟢 SOCKET CONNECTED:", socket.id);

      socket.emit("join-poll", pollId);

      console.log("🟢 JOINED POLL:", pollId);
    };

    const handlePollUpdated = (updatedResults) => {
      console.log("🔥 POLL UPDATED RECEIVED:", updatedResults);

      setResults(updatedResults);
    };

    socket.on("connect", handleConnect);
    socket.on("pollUpdated", handlePollUpdated);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("pollUpdated", handlePollUpdated);
      socket.disconnect();
    };
  }, [pollId]);
  // =====================================================
  // 4. Select option
  // =====================================================

  const handleOptionSelect = (optionId) => {
    if (voting || voteSuccess) {
      return;
    }

    setSelectedOption(optionId);
    setError("");
  };

  // =====================================================
  // 5. Submit vote
  // =====================================================

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Please select an option.");
      return;
    }

    try {
      setVoting(true);
      setError("");

      console.log("Submitting vote:", {
        pollId,
        optionId: selectedOption,
      });

      // 1. Submit vote
      const voteResponse = await voteOnPoll(pollId, selectedOption);

      console.log("Vote submitted:", voteResponse);

      // 2. Fetch latest results
      const resultsResponse = await getPollResults(pollId);

      console.log("Latest results after vote:", resultsResponse);

      // 3. Update UI immediately
      const latestResults = resultsResponse?.data ?? resultsResponse;

      setResults(latestResults);

      // 4. Show success
      setVoteSuccess(true);
    } catch (error) {
      console.error("Vote failed:", error);

      if (error.response?.status === 409) {
        setError(
          error.response?.data?.message ||
            "You have already voted on this poll.",
        );

        // Even if already voted, fetch current results
        try {
          const resultsResponse = await getPollResults(pollId);

          const latestResults = resultsResponse?.data ?? resultsResponse;

          setResults(latestResults);
        } catch (resultError) {
          console.error("Failed to fetch results:", resultError);
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
  // 6. Loading screen
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={22} className="animate-spin" />

          <span>Loading poll...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // 7. Poll not found
  // =====================================================

  if (!poll) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <AlertCircle size={36} className="mx-auto text-red-400" />

          <h1 className="mt-4 text-xl font-semibold">Poll not found</h1>

          <p className="mt-2 text-sm text-slate-400">
            {error || "This poll does not exist."}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // 8. Poll status
  // =====================================================

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) <= new Date();

  const isInactive = poll.isActive === false;

  const pollClosed = isExpired || isInactive;

  // =====================================================
  // 9. Options
  // =====================================================

  const pollOptions = results?.options || poll.options || [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        {/* ==========================================
            Poll Header
        ========================================== */}

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Vote size={16} />
            Poll
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {poll.title}
          </h1>

          {poll.description && (
            <p className="mt-4 leading-relaxed text-slate-400">
              {poll.description}
            </p>
          )}
        </div>

        {/* ==========================================
            Poll Card
        ========================================== */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          {/* ========================================
              Poll status / expiration
          ======================================== */}

          {poll.expiresAt && (
            <div className="mb-6 flex items-center gap-2 text-sm">
              <Clock
                size={16}
                className={isExpired ? "text-red-400" : "text-slate-500"}
              />

              {isExpired ? (
                <span className="text-red-400">Poll expired</span>
              ) : (
                <span className="text-slate-500">
                  Expires {new Date(poll.expiresAt).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {isInactive && !isExpired && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              This poll is no longer active.
            </div>
          )}

          {/* ========================================
              Total votes
          ======================================== */}

          {results && (
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-slate-500">Live results</span>

              <span className="text-sm font-medium text-slate-300">
                {results.totalVotes ?? 0}{" "}
                {results.totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>
          )}

          {/* ========================================
              Options
          ======================================== */}

          <div className="space-y-3">
            {pollOptions.map((option, index) => {
              const selected = selectedOption === option.id;

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
                      p-4
                      text-left
                      transition-all

                      ${
                        selected
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-slate-800 bg-slate-950 hover:border-slate-700"
                      }

                      ${
                        voting || voteSuccess || pollClosed
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer"
                      }
                    `}
                >
                  {/* Result progress bar */}

                  {results && (
                    <div
                      className="absolute inset-y-0 left-0 rounded-2xl bg-violet-500/10 transition-all duration-700"
                      style={{
                        width: `${option.percentage || 0}%`,
                      }}
                    />
                  )}

                  {/* Content */}

                  <div className="relative flex items-center gap-4">
                    {/* Radio */}

                    <div
                      className={`
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border

                          ${selected ? "border-violet-500" : "border-slate-600"}
                        `}
                    >
                      {selected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                      )}
                    </div>

                    {/* Number */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-medium text-slate-400">
                      {index + 1}
                    </div>

                    {/* Option text */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={
                            selected
                              ? "font-medium text-violet-200"
                              : "font-medium text-slate-200"
                          }
                        >
                          {option.text}
                        </span>

                        {/* Results */}

                        {results && (
                          <span className="shrink-0 text-sm text-slate-400">
                            {option.percentage ?? 0}%
                          </span>
                        )}
                      </div>

                      {/* Vote count */}

                      {results && (
                        <p className="mt-1 text-xs text-slate-500">
                          {option.votes ?? 0}{" "}
                          {option.votes === 1 ? "vote" : "votes"}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ========================================
              Error
          ======================================== */}

          {error && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={18} className="shrink-0" />

              <span>{error}</span>
            </div>
          )}

          {/* ========================================
              Success
          ======================================== */}

          {voteSuccess && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />

              <div>
                <p className="font-medium text-emerald-400">
                  Vote submitted successfully!
                </p>

                <p className="mt-1 text-sm text-emerald-400/70">
                  Results update automatically when new votes are submitted.
                </p>
              </div>
            </div>
          )}

          {/* ========================================
              Vote button
          ======================================== */}

          <button
            type="button"
            onClick={handleVote}
            disabled={!selectedOption || voting || voteSuccess || pollClosed}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {voting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
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

        {/* ==========================================
            Live indicator
        ========================================== */}

        {results && (
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live results
          </div>
        )}
      </div>
    </div>
  );
}
