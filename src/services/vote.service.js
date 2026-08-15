import { and, eq } from "drizzle-orm";
import ApiError from "../utils/ApiError.js";
import { db } from "../db/index.js";
import { polls, options, votes } from "../db/schema/index.js";

export const createVote = async ({ pollId, optionId, sessionId }) => {
  // 1. Find the poll
  const poll = await db.query.polls.findFirst({
    where: eq(polls.id, pollId),
  });

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // 2. Check whether poll is active
  if (!poll.isActive) {
    throw ApiError.badRequest("Poll is no longer active");
  }

  // 3. Check whether poll has expired
  if (poll.expiresAt && new Date() > poll.expiresAt) {
    throw ApiError.badRequest("Poll has expired");
  }

  // 4. Check whether selected option belongs to this poll
  const selectedOption = await db.query.options.findFirst({
    where: and(eq(options.id, optionId), eq(options.pollId, pollId)),
  });

  if (!selectedOption) {
    throw ApiError.badRequest("Selected option does not belong to this poll");
  }

  // 5. Create vote
  try {
    const [createdVote] = await db
      .insert(votes)
      .values({
        pollId,
        optionId,
        sessionId,
      })
      .returning();

    return createdVote;
  } catch (error) {
    console.error("VOTE INSERT ERROR:", error);

    const postgresError = error.cause;

    console.log("POSTGRES ERROR CODE:", postgresError?.code);

    console.log("POSTGRES ERROR MESSAGE:", postgresError?.message);

    if (postgresError?.code === "23505") {
      throw ApiError.conflict("You have already voted on this poll");
    }

    throw error;
  }
};
