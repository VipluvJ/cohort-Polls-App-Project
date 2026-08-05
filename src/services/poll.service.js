import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { polls, options } from "../db/schema/index.js";
import ApiError from "../utils/ApiError.js";

export const createPoll = async (pollData) => {
  const {
    title,
    description,
    options: pollOptions,
    isPublic,
    allowAnonymous,
    expiresAt,
  } = pollData;

  const result = await db.transaction(async (tx) => {
    // 1. Create poll
    const [createdPoll] = await tx
      .insert(polls)
      .values({
        title,
        description,
        isPublic,
        allowAnonymous,
        expiresAt,
      })
      .returning();

    // 2. Prepare options
    const optionRows = pollOptions.map((option) => {
      return {
        pollId: createdPoll.id,
        text: option,
      };
    });

    // 3. Insert options into OPTIONS TABLE
    const createdOptions = await tx
      .insert(options)
      .values(optionRows)
      .returning();

    // 4. Return complete poll
    return {
      ...createdPoll,
      options: createdOptions,
    };
  });

  return result;
};

export const getAllPolls = async () => {
  const allPolls = await db.query.polls.findMany({ with: { options: true } });
  return allPolls;
};

export const getPollById = async (id) => {
  const poll = await db.query.polls.findFirst({
    where: eq(polls.id, id),
    with: { options: true },
  });
  if (!poll) {
    throw ApiError.notFound("poll not found");
  }
  return poll;
};
