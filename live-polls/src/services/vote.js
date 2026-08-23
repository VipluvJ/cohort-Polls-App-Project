import api from "./axios";

export const submitVote = async ({ pollId, optionId }) => {
  const response = await api.post(`${pollId}/votes`, {
    pollId,
    optionId,
  });

  return response.data;
};
