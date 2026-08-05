import { z } from "zod";

export const voteSchema = z.object({
  optionId: z
    .string({
      error: "Option ID is required",
    })
    .uuid("Invalid option ID"),
});

export const pollIdSchema = z.object({
  pollId: z
    .string({
      error: "Poll ID is required",
    })
    .uuid("Invalid poll ID"),
});
