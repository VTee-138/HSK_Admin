import { get, post } from "../common/apiClient";

const PATH_SUBMISSION = "/exam-result/admin/submissions";

const getAdminSubmissions = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return await get(`${PATH_SUBMISSION}${queryString ? `?${queryString}` : ""}`);
};

const getAdminSubmissionDetail = async (resultId) => {
  return await get(`${PATH_SUBMISSION}/${resultId}`);
};

const recalculateScores = async () => {
  return await post("/exam-result/admin/recalculate-scores", {});
};

export { getAdminSubmissions, getAdminSubmissionDetail, recalculateScores };
