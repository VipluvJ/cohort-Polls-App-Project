import { db } from "../db/index.js";
import { polls, options } from "../db/schema/index.js";

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
