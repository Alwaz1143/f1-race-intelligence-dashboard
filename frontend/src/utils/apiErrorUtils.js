export function getApiErrorDetail(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail) {
    return JSON.stringify(detail);
  }

  return error?.message || "";
}

export function isOpenF1LiveSessionRestrictedError(error) {
  const status = error?.response?.status;
  const detail = getApiErrorDetail(error).toLowerCase();

  return (
    detail.includes("live f1 session in progress") ||
    (status === 401 && detail.includes("openf1 api error"))
  );
}