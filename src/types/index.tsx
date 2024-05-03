import { ReactElement } from 'react';

export type GuardProps = {
  children: ReactElement | null;
};

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export type IRole = {
  id: number;
  parent_id: number;
  label: string;
  fee: string;
  type: 'player' | 'agent' | 'super_admin';
};

export type IUpdateUser = {
  id?: number;
  name: string;
  email: string;
  money: string;
  win_count: number;
  lose_count: number;
  role_id: number;
  status: boolean;
  password: string;
};

export type IBalance = {
  id: number;
  user_id: number;
  amount: string;
  status: boolean;
  user: IUser;
  createdAt: string;
  updatedAt: string;
};

export type IRecord = {
  id: number;
  user_id: number;
  amount: number;
  action: string;
  createdAt: string;
  updatedAt: string;
  player_cards: string;
  current_money: string;
  user: IUser;
};

export type IUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  xp: number;
  money: string;
  agent_code: number;
  win_count: number;
  lose_count: number;
  rew_ad_count: number;
  status: boolean;
  role_id: number;
  createdAt: string;
  updatedAt: string;
  role?: IRole;
};

export type ApiContextType = {
  initialize: () => Promise<any>;
  login: (email: string, password: string) => Promise<any>;

  getUsers: () => Promise<any>;
  updateUser: (data: IUpdateUser) => Promise<any>;
  createUser: (data: IUpdateUser) => Promise<any>;
  deleteUser: (id: number) => Promise<any>;
  getRoles: () => Promise<any>;
  updateRoles: (data: IRole) => Promise<any>;
  getCharging: () => Promise<any>;
  getRecords: () => Promise<any>;
  approveCharging: (id: number) => Promise<any>;
  deleteCharging: (id: number) => Promise<any>;
};
