import { ReactElement } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

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
  player_role: string;
};

export type IRoom = {
  maxSeats: number;
  playerCount: number;
  roomId: number;
  roomMinBet: number;
  roomName: string;
};

export type IPlayerData = {
  isFold?: boolean;
  isPlayerTurn?: boolean;
  playerId: number;
  playerMoney?: number;
  playerName: string;
  timeBar?: number;
  timeLeft?: number;
  totalBet?: number;
  cards?: string[];
  isDealer?: boolean;
};

export type IUserAction = {
  actionText: string;
  playerId: number;
};

export type SocketContextType = {
  sendSocket: (data: { [key: string]: any }) => void;
  lastJsonMessage: any;
  connectionId: number;
};

export type ApiContextType = {
  initialize: () => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
};
