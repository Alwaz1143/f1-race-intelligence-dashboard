import axiosClient from "./axiosClient";

export const getBulkAnalytics = async (sessionKey) => {
  const response = await axiosClient.get("/analytics/bulk", {
    params: { session_key: sessionKey },
  });

  return response.data;
};

export const getDriverComparison = async (sessionKey, driver1, driver2) => {
  const response = await axiosClient.get("/analytics/compare-drivers", {
    params: {
      session_key: sessionKey,
      driver1,
      driver2,
    },
  });

  return response.data;
};

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

export const getSessions = async (meetingKey, raceKey) => {
  const params = {};
  if (meetingKey) params.meeting_key = meetingKey;
  else if (raceKey) params.race_key = raceKey;

  const response = await axiosClient.get("/sessions", { params });

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

export const compareDrivers = async (sessionKey, driver1, driver2) => {
  const response = await axiosClient.get("/analytics/compare-drivers", {
    params: {
      session_key: sessionKey,
      driver1,
      driver2,
    },
  });

  return response.data;
};

export const getAiSummary = async (sessionKey) => {
  const response = await axiosClient.get("/analytics/ai-summary", {
    params: {
      session_key: sessionKey,
    },
  });

  return response.data;
};
export const getRaceClassification = async (year, round) => {
  const response = await axiosClient.get("/results/race-classification", {
    params: {
      year,
      round,
    },
  });

  return response.data;
};

