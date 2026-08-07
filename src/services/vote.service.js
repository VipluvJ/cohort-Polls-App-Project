import { and, eq } from "drizzle-orm";
import ApiError from "../utils/ApiError.js";
import { db } from "../db/index.js";
import { polls, options, votes } from "../db/schema/index.js";

export const createVote = async ({ pollId, optionId, sessionId }) => {
  //find the poll
  const poll = await db.query.polls.findFirst({ where: eq(polls.id, pollId) });

  if (!poll) {
    throw ApiError.notFound("poll not found");
  }
  // 2. Check whether poll is active
  if (!poll.isActive) {
    throw ApiError.badRequest("Poll is no longer active");
  }

  // 3. Check whether poll has expired
  if (poll.expiresAt && new Date() > poll.expiresAt) {
    throw ApiError.badRequest("Poll has expired");
  }

  // 4. Find the selected option
  const selectedOption = await db.query.options.findFirst({
    where: and(eq(options.id, optionId), eq(options.pollId, pollId)),
  });

  // This also prevents using an option from another poll
  if (!selectedOption) {
    throw ApiError.badRequest("Selected option does not belong to this poll");
  }

  // 5. Check whether this session already voted on this poll
  const existingVote = await db
    .select({
      id: votes.id,
    })
    .from(votes)
    .innerJoin(options, eq(votes.optionId, options.id))
    .where(and(eq(options.pollId, pollId), eq(votes.sessionId, sessionId)))
    .limit(1);

  if (existingVote.length > 0) {
    throw ApiError.conflict("You have already voted on this poll");
  }

  // 6. Create vote
  const [createdVote] = await db
    .insert(votes)
    .values({
      optionId,
      sessionId,
    })
    .returning();

  return createdVote;
};
