import axios from "axios";
// axios used like fitch 

export const api = axios.create({
  baseURL: "http://localhost:3030",
});

// called after login / register / logout
export function setAuthHeaders(user: { id: number; role: "user" | "admin" } | null) {
  if (user) {
    api.defaults.headers.common["x-user-id"] = String(user.id);
    api.defaults.headers.common["x-user-role"] = user.role;
  } else {
    delete api.defaults.headers.common["x-user-id"];
    delete api.defaults.headers.common["x-user-role"];
  }
}
