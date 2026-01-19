import { App } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { apiUrl } from '../utils/index';

interface PostRequestState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  postData: (requestData: any) => Promise<T | null>;
}

const usePostAPI = <T>(
  url: string,
  showMessage = true
): PostRequestState<T> => {
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const postData = async (requestData: any): Promise<T | null> => {
    setLoading(true);
    try {
      console.log('POST Request:', {
        url: `${apiUrl}/${url}`,
        data: requestData,
        config: { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      });

      const response: AxiosResponse = await axios.post(
        `${apiUrl}/${url}`,
        requestData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // Added timeout to prevent hanging
        }
      );

      console.log('POST Response:', {
        status: response.status,
        data: response.data
      });

      if (response.status >= 200 && response.status < 300) {
        setData(response.data);
        setError(null);
        if (showMessage) {
          message.success(response.data.message || 'Operation successful');
        }
        return response.data;
      } else {
        const errorMessage = `Unexpected response status: ${response.status}`;
        setError(errorMessage);
        if (showMessage) {
          message.error(errorMessage);
        }
        return null;
      }
    } catch (error: any) {
      console.error('POST Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      setError(errorMessage);
      if (showMessage) {
        message.error(`Error: ${errorMessage}`);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, postData };
};

export default usePostAPI;