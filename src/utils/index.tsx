import { NavigateFunction } from "react-router-dom";
import Cookies from "js-cookie";

// export const apiUrl = "http://localhost:5000/api";
// export const apiUrl = "https://ndnb.onrender.com/api";
export const apiUrl = "https://backend.ndnb.com.np/api"; //Staging
// export const apiUrl = "https://app.ndnb.com.np/api"; //Live

export const isAuthenticated = (): boolean => {
  const localToken = localStorage.getItem("authToken");
  const cookieToken = Cookies.get("authToken");
  return !!(localToken && cookieToken);
};

export const handleSignOut = (navigate: NavigateFunction): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("Id");
  Cookies.remove("authToken", { path: "/" });
  navigate("/login");
};
