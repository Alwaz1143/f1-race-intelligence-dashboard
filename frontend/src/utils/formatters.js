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