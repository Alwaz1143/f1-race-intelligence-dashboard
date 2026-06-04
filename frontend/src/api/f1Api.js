import axiosClient from "./axiosClient";

export const getHealth = async () => {
  const response = await axiosClient.get("/health");
  return response.data;
};

export const getRaces = async (year) => {
  const response = await axiosClient.get("/races", {
    params: { year },
  });

  return response.data;
};

export const getSessions = async (meetingKey) => {
  const response = await axiosClient.get("/sessions", {
    params: { meeting_key: meetingKey },
  });

  return response.data;
};

export const getSessionOverview = async (sessionKey) => {
  const response = await axiosClient.get("/analytics/session-overview", {
    params: { session_key: sessionKey },
  });

  return response.data;
};