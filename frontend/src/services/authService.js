import api from "./api.js";

export const authService = {
  register(payload) {
    return api.post("/auth/register", payload);
  },
  login(payload) {
    return api.post("/auth/login", payload);
  },
  getMe() {
    return api.get("/auth/me");
  },
};
