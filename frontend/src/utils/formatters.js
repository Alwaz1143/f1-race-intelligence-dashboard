export const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  return new Date(dateValue).toLocaleString();
};

export const formatTimeOnly = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  return new Date(dateValue).toLocaleTimeString();
};

export const formatSeconds = (value, decimals = 3) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return Number(value).toFixed(decimals);
};

export const formatSecondsWithUnit = (value, decimals = 3) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return `${Number(value).toFixed(decimals)}s`;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return Number(value).toLocaleString();
};


export const formatDurationTime = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  const totalSecondsFloat = Number(value);

  if (totalSecondsFloat < 0) {
    return "N/A";
  }

  let minutes = Math.floor(totalSecondsFloat / 60);
  let seconds = Math.floor(totalSecondsFloat % 60);
  let centiseconds = Math.round((totalSecondsFloat - Math.floor(totalSecondsFloat)) * 100);

  if (centiseconds === 100) {
    centiseconds = 0;
    seconds += 1;
  }

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${String(centiseconds).padStart(2, "0")}`;
};