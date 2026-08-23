import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Check,
  Clock,
  Loader2,
  Vote,
} from "lucide-react";

import { getPoll } from "../services/poll.service";
import { submitVote } from "../services/vote.js";

const PollDetails = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submittingVote, setSubmittingVote] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [voteSuccess, setVoteSuccess] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPoll(pollId);

      setPoll(response.data);
    } catch (error) {
      console.error("Failed to fetch poll:", error.response?.data || error);

      setError(error.response?.data?.message || "Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) {
      setVoteError("Please select an option before voting.");
      return;
    }

    try {
      setSubmittingVote(true);
      setVoteError("");

      const response = await submitVote({
        pollId,
        optionId: selectedOption,
      });

      console.log("Vote submitted:", response);

      setVoteSuccess(true);

      // Refresh poll/results after successful vote
      await fetchPoll();
    } catch (error) {
      console.error("Vote failed:", error.response?.data || error);

      setVoteError(
        error.response?.data?.message || "Unable to submit your vote",
      );
    } finally {
      setSubmittingVote(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading && !poll) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-zinc-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mb-8 h-8 w-32 rounded bg-zinc-800" />

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="mb-6 h-10 w-3/4 rounded bg-zinc-800" />
            <div className="mb-8 h-4 w-full rounded bg-zinc-800" />

            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-3 h-16 rounded-xl bg-zinc-800" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-900/50 bg-zinc-900 p-8 text-center">
          <h2 className="text-xl font-semibold">Unable to load poll</h2>

          <p className="mt-3 text-sm text-zinc-400">{error}</p>

          <button
            onClick={() => navigate("/polls")}
            className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Back to Explore
          </button>
        </div>
      </main>
    );
  }

  if (!poll) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Poll not found</h2>

          <button
            onClick={() => navigate("/polls")}
            className="mt-6 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm transition hover:bg-zinc-900"
          >
            Explore Polls
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-zinc-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/polls")}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Explore
        </button>

        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {/* Poll information */}
          <div className="border-b border-zinc-800 p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                <Vote size={14} />
                {poll.totalVotes || 0} votes
              </span>

              <span className="rounded-full border border-emerald-900/70 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400">
                Active
              </span>

              {poll.expiresAt && (
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock size={14} />
                  Ends {formatDate(poll.expiresAt)}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {poll.title}
            </h1>

            {poll.description && (
              <p className="mt-4 leading-7 text-zinc-400">{poll.description}</p>
            )}
          </div>

          {/* Voting */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Choose your answer</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Anyone can vote. One vote is allowed per session.
                </p>
              </div>

              <BarChart3 size={22} className="text-zinc-600" />
            </div>

            <div className="space-y-3">
              {poll.options?.map((option, index) => {
                const isSelected = selectedOption === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (!submittingVote && !voteSuccess) {
                        setSelectedOption(option.id);
                        setVoteError("");
                      }
                    }}
                    disabled={submittingVote || voteSuccess}
                    className={`group flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition ${
                      isSelected
                        ? "border-white bg-zinc-800"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900"
                    } ${
                      submittingVote || voteSuccess
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
                          isSelected
                            ? "border-white bg-white text-black"
                            : "border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {isSelected ? <Check size={16} /> : index + 1}
                      </span>

                      <span className="font-medium text-zinc-200">
                        {option.text}
                      </span>
                    </div>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-white" : "border-zinc-700"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {voteError && (
              <p className="mt-4 text-sm text-red-400">{voteError}</p>
            )}

            {voteSuccess && (
              <div className="mt-5 rounded-xl border border-emerald-900/70 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
                Your vote has been submitted successfully.
              </div>
            )}

            <button
              type="button"
              onClick={handleVote}
              disabled={!selectedOption || submittingVote || voteSuccess}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submittingVote ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting vote...
                </>
              ) : voteSuccess ? (
                <>
                  <Check size={18} />
                  Vote Submitted
                </>
              ) : (
                <>
                  <Vote size={18} />
                  Submit Vote
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/50 px-6 py-4 text-xs text-zinc-500 sm:px-8">
            <span>One vote per browser session</span>

            <span>{poll.totalVotes || 0} total votes</span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PollDetails;
