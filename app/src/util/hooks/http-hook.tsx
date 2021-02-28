import { useReducer, useCallback } from "react";
import axios from "../config/axios-instance";

import { httpActionType, httpReducer } from "../reducers/http-reducer";

export type HTTP_METHOD = "GET" | "POST" | "PATCH" | "DELETE";

export const useHttpClient = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    success: false,
  });

  const httpHelper = useCallback(
    async (axiosInstance: any, url: string, body?: object | null) => {
      dispatchHttp({ type: httpActionType.SEND });
      try {
        const response = await axiosInstance(`${url}`, body);
        dispatchHttp({ type: httpActionType.RESPONSE });
        return response;
      } catch (error) {
        dispatchHttp({
          type: httpActionType.ERROR,
          error: error.response.data || "An unknown Error occurred",
        });
        throw new Error(error);
      }
    },
    []
  );

  const sendRequest = useCallback( 
    (url: string, method: HTTP_METHOD = "GET", body: object | null = null) => {
      switch (method) {
        case "GET":
          return httpHelper(axios.get, url);
        case "POST":
          return httpHelper(axios.post, url, body);
        case "PATCH":
          return httpHelper(axios.patch, url, body);
        case "DELETE":
          return httpHelper(axios.delete, url);
        default:
          throw new Error("An unknown Error occurred");
      }
    },
    [httpHelper]
  );

  const clearError = useCallback(() => {
    dispatchHttp({ type: httpActionType.RESET });
  }, []);

  
  return { httpState, sendRequest, clearError };
};
