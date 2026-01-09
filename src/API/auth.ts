import axios, { AxiosError, AxiosResponse } from "axios";

export const authAPIGet = async (url: never, token?: never) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    };
    const response: AxiosResponse = await axios.get(url, config);

    if (response && response.data) {
      const responseData = response.data;
      return responseData;
    } else {
      throw new Error("Invalid response format: Missing data property");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      if (axiosError.response) {
        const { status, data } = axiosError.response;
        if (status === 401) {
          throw new Error("Unauthorized: Invalid credentials");
        } else {
          throw new Error(`HTTP error ${status}: ${JSON.stringify(data)}`);
        }
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    } else {
      throw new Error(`Error: ${error}`);
    }
  }
};

export const authAPIPost = async (url: string, credentials: object) => {
  try {
    const response: AxiosResponse = await axios.post(url, credentials);

    if (response && response.data) {
      const responseData = response.data;

      return responseData;
    } else {
      throw new Error("Invalid response format: Missing data property");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      if (axiosError.response) {
        const { status, data } = axiosError.response;

        if (status === 401) {
          throw new Error("Unauthorized: Invalid credentials");
        } else {
          throw new Error(`HTTP error ${status}: ${JSON.stringify(data)}`);
        }
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    } else {
      throw new Error(`Error: ${error}`);
    }
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
