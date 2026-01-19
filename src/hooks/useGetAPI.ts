import { App } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '../utils/index';

interface GetRequestState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

const useGetAPI = <T>(
  url: string,
  showMessage = true,
  hasData = true
): GetRequestState<T> => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: AxiosResponse = await axios.get(`${apiUrl}/${url}`, {
          withCredentials: true, // Include cookies for session-based authentication
          headers: {
            // Optional: Add Authorization header if using token-based auth
            // Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (response && response.data) {
          const responseData = response.data;
          setData(responseData?.data || null);
          setError(null);
          // showMessage && message.success(responseData?.message || 'Data fetched successfully');
        } else {
          message.error('Invalid response format: Missing data property');
          setError('Invalid response format');
        }
      } catch (error: any) {
        const errorMessage = error.response?.status === 401
          ? 'Unauthorized: Please log in or provide valid credentials'
          : `Error fetching data: ${error.message}`;
        message.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (hasData) {
      fetchData();
    }
  }, [url, showMessage, hasData]);

  return { loading, error, data };
};

export default useGetAPI;