const BASE_URL = import.meta.env.VITE_APP_API_URL;

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
  },
  ADMIN: {
    ADMIN_USERS_STATS: `${BASE_URL}/api/admin/dashboard/stats`,
    USERS: `${BASE_URL}/api/admin/users`,
    SUSPEND_USER: (userId) => `${BASE_URL}/api/admin/${userId}/suspend`,
    ACTIVATE_USER: (userId) => `${BASE_URL}/api/admin/${userId}/activate`,
    DELETE_USER: (userId) => `${BASE_URL}/api/admin/user/${userId}`,
  },
  DASHBOARD: {
    STATS: (userId) => `${BASE_URL}/api/dashboard/stats/${userId}`,
  },
  PROFILE: {
    GET_PROFILE: (userId) => `${BASE_URL}/api/profile/${userId}`,
  },
  TASKS: {
    POST_TASKS: `${BASE_URL}/api/tasks`,
    GET_TASKS: (userId) => `${BASE_URL}/api/tasks/user/${userId}`,
    UPDATE_TASK: (userId, taskId) =>
      `${BASE_URL}/api/tasks/user/${userId}/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `${BASE_URL}/api/tasks/user/${taskId}`,
  },
  USER: {
    USER_PROFILE: (userId) => `${BASE_URL}/api/users/user/${userId}`,
    UPDATE_PROFILE: (userId) =>
      `${BASE_URL}/api/users/update-profile/${userId}`,
  },
};

export default API_ENDPOINTS;
