import { NavigateFunction } from "react-router-dom";
import Cookies from "js-cookie";

// Define the shape of our window object
declare global {
  interface Window {
    appConfig: {
      apiUrl: string;
    };
  }
}


export const apiUrl = window.appConfig?.apiUrl || "https://backend.ndnb.com.np/api";

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
