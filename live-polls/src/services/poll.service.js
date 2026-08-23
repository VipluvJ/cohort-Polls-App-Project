import api from "./axios";

// Create a new poll
export const createPoll = async (pollData) => {
  const response = await api.post("/", pollData);

  return response.data;
};

// Get a single poll
export const getPoll = async (pollId) => {
  const response = await api.get(`/${pollId}`);

  return response.data;
};

// Get all polls
export const getPolls = async () => {
  const response = await api.get("/");

  return response.data;
};

// Vote on a poll
export const voteOnPoll = async (pollId, optionId) => {
  const response = await api.post(`/${pollId}/votes`, {
    optionId,
  });

  return response.data;
};

export const getPollResults = async (pollId) => {
  const response = await api.get(`/${pollId}/results`);

  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};

export const getActivePolls = async () => {
  const response = await api.get("/active-polls");

  return response.data;
};
