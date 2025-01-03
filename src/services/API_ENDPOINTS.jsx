const BASE_URL = "http://localhost:8080/api";

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REGISTER: `${BASE_URL}/auth/register`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },
  ADMIN: {
    ADMIN_USERS_STATS: `${BASE_URL}/admin/dashboard/stats`,
    USERS: `${BASE_URL}/admin/users`,
    SUSPEND_USER: (userId) => `${BASE_URL}/admin/${userId}/suspend`,
    ACTIVATE_USER: (userId) => `${BASE_URL}/admin/${userId}/activate`,
    DELETE_USER: (userId) => `${BASE_URL}/admin/user/${userId}`,
  },
  DASHBOARD: {
    STATS: (userId) => `${BASE_URL}/dashboard/stats/${userId}`,
  },
  PROFILE: {
    GET_PROFILE: (userId) => `${BASE_URL}/profile/${userId}`,
  },
  TASKS: {
    POST_TASKS: `${BASE_URL}/tasks`,
    GET_TASKS: (userId) => `${BASE_URL}/tasks/user/${userId}`,
    UPDATE_TASK: (userId, taskId) =>
      `${BASE_URL}/tasks/user/${userId}/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `${BASE_URL}/tasks/user/${taskId}`,
  },
  USER: {
    USER_PROFILE: (userId) => `${BASE_URL}/users/user/${userId}`,
    UPDATE_PROFILE: (userId) => `${BASE_URL}/users/update-profile/${userId}`,
  },
};

export default API_ENDPOINTS;
