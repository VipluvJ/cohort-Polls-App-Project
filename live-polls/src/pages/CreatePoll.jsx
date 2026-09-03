import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { createPoll } from "../services/poll.service";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isPublic, setIsPublic] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions(options.filter((_, optionIndex) => optionIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanedOptions = options
      .map((option) => option.trim())
      .filter(Boolean);

    if (!title.trim()) {
      setError("Please enter a poll question.");
      return;
    }

    if (cleanedOptions.length < 2) {
      setError("A poll must have at least two options.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        options: cleanedOptions,
        isPublic,
        allowAnonymous,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      };

      const response = await createPoll(payload);

      const poll = response?.data ?? response;

      if (poll?.id) {
        navigate(`/${poll.id}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create poll:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create poll. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f3eb] px-5 py-12 text-[#171717] sm:px-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-3xl"
      >
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#8a8175]">
            New poll
          </p>

          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            Create a poll
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#756f66] sm:text-base">
            Ask a question and let people decide.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Question */}
          <section className="mb-12">
            <label
              htmlFor="title"
              className="mb-4 block text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8175]"
            >
              Question
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What's the best JavaScript framework?"
              className="w-full border-0 border-b border-[#d7d0c5] bg-transparent px-0 pb-4 text-xl outline-none transition-colors placeholder:text-[#aaa298] focus:border-[#171717] sm:text-2xl"
              maxLength={200}
            />
          </section>

          {/* Description */}
          <section className="mb-12">
            <label
              htmlFor="description"
              className="mb-4 block text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8175]"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional context for your poll..."
              rows={3}
              className="w-full resize-none border-0 border-b border-[#d7d0c5] bg-transparent px-0 pb-4 text-base leading-7 outline-none transition-colors placeholder:text-[#aaa298] focus:border-[#171717]"
              maxLength={500}
            />
          </section>

          {/* Options */}
          <section className="mb-12">
            <div className="mb-5 flex items-end justify-between">
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8175]">
                Options
              </label>

              <span className="text-xs text-[#aaa298]">
                {options.length} options
              </span>
            </div>

            <div className="border-t border-[#d7d0c5]">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-center border-b border-[#d7d0c5]"
                >
                  <span className="w-10 shrink-0 py-4 font-mono text-xs text-[#aaa298]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <input
                    type="text"
                    value={option}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                    placeholder={
                      index === 0
                        ? "First option"
                        : index === 1
                          ? "Second option"
                          : "Another option"
                    }
                    className="min-w-0 flex-1 border-0 bg-transparent py-4 text-base outline-none placeholder:text-[#aaa298]"
                    maxLength={150}
                  />

                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="mr-1 rounded p-2 text-[#aaa298] opacity-0 transition-all hover:bg-[#ebe5db] hover:text-[#171717] group-hover:opacity-100"
                      aria-label={`Remove option ${index + 1}`}
                    >
                      <Trash2 size={15} strokeWidth={1.7} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            <button
              type="button"
              onClick={addOption}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#5f584f] transition-colors hover:text-[#171717]"
            >
              <Plus size={16} strokeWidth={1.8} />
              Add another option
            </button>
          </section>

          {/* Settings */}
          <section className="mb-12">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8175]">
              Settings
            </p>

            <div className="border-y border-[#d7d0c5]">
              {/* Public */}
              {/* Public */}
              <label className="flex cursor-pointer items-center justify-between gap-6 border-b border-[#d7d0c5] py-5">
                <div>
                  <p className="text-sm font-medium">Public poll</p>
                  <p className="mt-1 text-xs leading-5 text-[#8a8175]">
                    Anyone can discover and vote on this poll.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublic}
                  onClick={() => setIsPublic((prev) => !prev)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                    isPublic ? "bg-[#171717]" : "bg-[#d2cbc0]"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      isPublic ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>

              {/* Anonymous */}
              <label className="flex cursor-pointer items-center justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium">Anonymous voting</p>
                  <p className="mt-1 text-xs leading-5 text-[#8a8175]">
                    Voters can participate without signing in.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={allowAnonymous}
                  onClick={() => setAllowAnonymous((prev) => !prev)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                    allowAnonymous ? "bg-[#171717]" : "bg-[#d2cbc0]"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      allowAnonymous ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            </div>
          </section>

          {/* Expiration */}
          <section className="mb-12">
            <label
              htmlFor="expiresAt"
              className="mb-4 block text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8175]"
            >
              Expiration
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="border-b border-[#d7d0c5] bg-transparent px-0 py-3 text-sm outline-none transition-colors focus:border-[#171717]"
              />

              {expiresAt && (
                <button
                  type="button"
                  onClick={() => setExpiresAt("")}
                  className="self-start text-xs text-[#8a8175] underline underline-offset-4 hover:text-[#171717]"
                >
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 border-l-2 border-red-700 bg-[#eee7dd] px-4 py-3 text-sm text-red-800"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between border-t border-[#d7d0c5] pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-[#8a8175] transition-colors hover:text-[#171717]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center gap-2 bg-[#171717] px-6 py-3 text-sm font-medium text-[#f7f3eb] transition-all hover:bg-[#302d29] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create poll"}

              {!loading && (
                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
};

export default CreatePoll;
