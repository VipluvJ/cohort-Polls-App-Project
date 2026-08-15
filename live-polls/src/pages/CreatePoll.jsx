import { useState } from "react";
import { Plus, Trash2, Clock, CheckCircle2, Sparkles } from "lucide-react";

import { createPoll } from "../services/poll.service";

export default function CreatePoll() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [options, setOptions] = useState(["", ""]);

  const [isPublic, setIsPublic] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Options
  // -----------------------------

  const updateOption = (index, value) => {
    const updatedOptions = [...options];

    updatedOptions[index] = value;

    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    // Keep at least 2 options
    if (options.length <= 2) {
      return;
    }

    setOptions(options.filter((_, optionIndex) => optionIndex !== index));
  };

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a poll title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a poll description.");
      return;
    }

    const cleanedOptions = options
      .map((option) => option.trim())
      .filter((option) => option !== "");

    if (cleanedOptions.length < 2) {
      setError("A poll must have at least 2 options.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      options: cleanedOptions,
      isPublic,
      allowAnonymous,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    };

    console.log("Sending payload:", payload);

    try {
      setLoading(true);

      const response = await createPoll(payload);

      console.log("Poll created:", response);
    } catch (error) {
      console.error("Create poll failed:", error);

      setError(error.response?.data?.message || "Failed to create poll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-600/20 px-4 py-1 text-sm text-violet-300">
            <Sparkles size={16} />
            Create a New Poll
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Create your poll
          </h1>

          <p className="mt-3 text-slate-400">
            Ask a question, add your options, and share it with others.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* -------------------------------- */}
          {/* Poll Information */}
          {/* -------------------------------- */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-lg font-semibold">Poll Information</h2>

            {/* Title */}

            <div className="mt-6">
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-300"
              >
                Poll Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                maxLength={150}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your favorite programming language?"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
              />

              <div className="mt-2 text-right text-xs text-slate-500">
                {title.length}/150
              </div>
            </div>

            {/* Description */}

            <div className="mt-5">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={4}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some context about your poll..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
              />

              <div className="mt-2 text-right text-xs text-slate-500">
                {description.length}/500
              </div>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Options */}
          {/* -------------------------------- */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Poll Options</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add at least two options.
                </p>
              </div>

              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-500 active:scale-[0.98]"
              >
                <Plus size={18} />
                Add Option
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  {/* Number */}

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-400">
                    {index + 1}
                  </div>

                  {/* Input */}

                  <input
                    type="text"
                    value={option}
                    maxLength={100}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                  />

                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                    className="rounded-xl border border-red-500/20 p-3 text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Visibility */}
          {/* -------------------------------- */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-lg font-semibold">Poll Visibility</h2>

            <div className="mt-6 space-y-4">
              {/* Public */}

              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-violet-600"
                />

                <div>
                  <p className="font-medium">Public poll</p>

                  <p className="mt-1 text-sm text-slate-500">
                    Anyone with access can view this poll.
                  </p>
                </div>
              </label>

              {/* Anonymous */}

              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={allowAnonymous}
                  onChange={(e) => setAllowAnonymous(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-violet-600"
                />

                <div>
                  <p className="font-medium">Allow anonymous voting</p>

                  <p className="mt-1 text-sm text-slate-500">
                    People can vote without creating an account.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Expiration */}
          {/* -------------------------------- */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Clock size={20} />
              Poll Expiration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose when this poll should stop accepting votes.
            </p>

            <div className="mt-6">
              <label
                htmlFor="expiresAt"
                className="text-sm font-medium text-slate-300"
              >
                Expiration Date & Time
              </label>

              <input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Leave empty if the poll should never expire.
              </p>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Error */}
          {/* -------------------------------- */}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* -------------------------------- */}
          {/* Submit */}
          {/* -------------------------------- */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 text-lg font-semibold transition hover:bg-violet-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={22} />

            {loading ? "Creating Poll..." : "Create Poll"}
          </button>
        </form>
      </div>
    </div>
  );
}
