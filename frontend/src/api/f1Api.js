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

export const getFastestLaps = async (sessionKey) => {
  const response = await axiosClient.get("/analytics/fastest-laps", {
    params: { session_key: sessionKey },
  });

  return response.data;
};

export const getDrivers = async (sessionKey) => {
  const response = await axiosClient.get("/drivers", {
    params: { session_key: sessionKey },
  });

  return response.data;
};

export const getRaceControl = async (sessionKey) => {
  const response = await axiosClient.get("/race-control", {
    params: { session_key: sessionKey },
  });

  return response.data;
};