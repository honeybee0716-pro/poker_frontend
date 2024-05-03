import axios, { AxiosRequestConfig } from 'axios';
// config
import { API_URL } from 'src/config-global';
import { enqueueSnackbar } from 'notistack';
import { store } from 'src/store';
import { signout } from 'src/store/reducers/auth';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(
  (config: any) => {
    config.baseURL = API_URL;
    const state = store.getState() as any;
    const accessToken = state.auth.token;
    if (accessToken) {
      config.headers['x-auth-token'] = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 400) {
      console.error(response.data);
      enqueueSnackbar(response.data, { variant: 'error' });
    } else if (response && response.status === 401) {
      store.dispatch(signout());
    } else if (response && response.status === 402) {
      enqueueSnackbar(response.data, { variant: 'error' });
    } else if (response && response.status === 404) {
      enqueueSnackbar("API not found", { variant: 'error' });
    } else {
      enqueueSnackbar(response?.data || "API error", { variant: 'error' });
    }
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
