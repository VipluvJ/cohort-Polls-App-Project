import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { polls, options, votes } from "../db/schema/index.js";

import ApiError from "../utils/ApiError.js";

export const getPollResults = async (pollId) => {
  // 1. Find poll
  const poll = await db.query.polls.findFirst({
    where: eq(polls.id, pollId),
  });

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // 2. Fetch all options for this poll
  const pollOptions = await db.query.options.findMany({
    where: eq(options.pollId, pollId),
  });

  // 3. Fetch all votes for this poll
  const pollVotes = await db
    .select()
    .from(votes)
    .innerJoin(options, eq(votes.optionId, options.id))
    .where(eq(options.pollId, pollId));

  // 4. Calculate total votes
  const totalVotes = pollVotes.length;

  // 5. Calculate votes and percentage for every option
  const resultOptions = pollOptions.map((option) => {
    const voteCount = pollVotes.filter(
      (vote) => vote.options.id === option.id,
    ).length;

    // const percentage =
    //   totalVotes === 0
    //     ? 0
    //     : Number(((voteCount / totalVotes) * 100).toFixed(2));

    let percentage = 0;

    if (totalVotes > 0) {
      const rawPercentage = (voteCount / totalVotes) * 100;
      percentage = Number(rawPercentage.toFixed(2));
    }

    return {
      id: option.id,
      text: option.text,
      votes: voteCount,
      percentage,
    };
  });

  // 6. Return final response
  return {
    pollId: poll.id,
    title: poll.title,
    description: poll.description,
    totalVotes,
    options: resultOptions,
  };
};
