import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivePolls } from "../services/poll.service";

const ExplorePolls = () => {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading polls...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div>
          <p className="text-sm text-zinc-500">
            Discover what people are asking
          </p>

          <h2 className="mt-1 text-3xl font-bold">Explore Active Polls</h2>
        </div>

        {polls.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-zinc-800 p-12 text-center">
            <h3 className="text-lg font-medium">No active polls</h3>

            <p className="mt-2 text-sm text-zinc-500">
              Check back later or create the first one.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold">{poll.title}</h3>

                    {poll.description && (
                      <p className="mt-2 text-sm text-zinc-400">
                        {poll.description}
                      </p>
                    )}

                    <p className="mt-4 text-xs text-zinc-500">
                      {poll.expiresAt
                        ? `Ends ${new Date(poll.expiresAt).toLocaleString()}`
                        : "No expiration"}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/${poll.id}`)}
                    className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800"
                  >
                    View & Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePolls;
