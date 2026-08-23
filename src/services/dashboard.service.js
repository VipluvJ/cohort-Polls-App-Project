import { eq, count, inArray } from "drizzle-orm";

import { db } from "../db/index.js";
import { polls, votes } from "../db/schema/index.js";

export const getDashboard = async (userId) => {
  // Get all polls belonging to this user
  const userPolls = await db
    .select()
    .from(polls)
    .where(eq(polls.userId, userId));

  const totalPolls = userPolls.length;

  const activePolls = userPolls.filter((poll) => poll.isActive).length;

  const closedPolls = userPolls.filter((poll) => !poll.isActive).length;

  const pollIds = userPolls.map((poll) => poll.id);

  let totalVotes = 0;

  if (pollIds.length > 0) {
    const [result] = await db
      .select({
        count: count(),
      })
      .from(votes)
      .where(inArray(votes.pollId, pollIds));

    totalVotes = Number(result.count);
  }

  return {
    stats: {
      totalPolls,
      activePolls,
      closedPolls,
      totalVotes,
    },

    polls: userPolls,
  };
};
