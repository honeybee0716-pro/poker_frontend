import React, { createContext } from 'react';
import axios from 'src/utils/axios';
import { API_PATH } from 'src/config-global';
import { ApiContextType, IRole, IUpdateUser } from 'src/types';
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

  const getUsers = async () => {
    return await axios.get(API_PATH.USERS);
  };

  const createUser = async (data: IUpdateUser) => {
    return await axios.post(API_PATH.USERS, data);
  };

  const updateUser = async (data: IUpdateUser) => {
    return await axios.put(API_PATH.USERS, data);
  };

  const deleteUser = async (id: number) => {
    return await axios.post(API_PATH.USER_DELETE, { id });
  };

  const getRoles = async () => {
    return await axios.get(API_PATH.ROLES);
  };

  const updateRoles = async (data: IRole) => {
    return await axios.post(API_PATH.ROLES, data);
  };

  const getCharging = async () => {
    return await axios.get(API_PATH.CHARGING);
  };

  const approveCharging = async (id: number) => {
    return await axios.post(API_PATH.CHARGING, { id });
  };

  const deleteCharging = async (id: number) => {
    return await axios.put(API_PATH.CHARGING, { id });
  };

  const getRecords = async () => {
    return await axios.get(API_PATH.RECORDS);
  };

  return (
    <ApiContext.Provider
      value={{
        initialize,
        login,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        getRoles,
        updateRoles,
        getCharging,
        getRecords,
        approveCharging,
        deleteCharging,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
