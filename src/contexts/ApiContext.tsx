import React, { createContext } from 'react';
import axios from 'src/utils/axios';
import { API_PATH } from 'src/config-global';
import { ApiContextType } from 'src/types';
import { useDispatch, useSelector } from 'src/store';
import { edit } from 'src/store/reducers/auth';

const ApiContext = createContext<ApiContextType | null>(null);
/* eslint-disable */
export const ApiProvider = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const initialize = async () => {
    const res = await axios.get(API_PATH.AUTH_GET_ME);
    if (!res?.data) return;
    return dispatch(edit(res.data));
  };

  const login = async (email: string, password: string) => {
    return await axios.post(API_PATH.LOGIN, { email, password });
  };

  return (
    <ApiContext.Provider
      value={{
        initialize,
        login,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
