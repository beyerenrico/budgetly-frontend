import axios, { RawAxiosRequestHeaders } from "axios";

import { useTokenStore } from "../stores";

const request = async <T>(
  method: string,
  url: string,
  headerType: "AUTHENTICATED" | "PUBLIC",
  data?: T,
  customHeaders?: RawAxiosRequestHeaders
) => {
  let headers;

  const { accessToken } = useTokenStore.getState().tokens;

  switch (headerType) {
    case "AUTHENTICATED": {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      break;
    }
    case "PUBLIC": {
      headers = {
        "Content-Type": "application/json",
      };
      break;
    }
    default: {
      headers = {
        "Content-Type": "application/json",
      };
      break;
    }
  }

  return axios({
    baseURL: "http://localhost:3000",
    method,
    url,
    data,
    headers: { ...headers, ...customHeaders },
  });
};

export { request };
