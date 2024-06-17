// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_HOST_API;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.users.root as string; // as '/dashboard'

export const API_URL = process.env.REACT_APP_API_URL;

export const API_PATH = {
  // auth
  LOGIN: '/api/admin/login',
  USERS: '/api/admin/users',
  USER_DELETE: '/api/admin/user/delete',
  ROLES: '/api/admin/roles',
  CHARGING: '/api/admin/charging',
  RECORDS: '/api/admin/records',
  AUTH_GET_ME: '/api/admin/auth/me',
};

export const SOCKET_KEY = {
  // auth
  LOGIN: 'userLogin',
  LOGIN_RES: 'loginResult',
  REGISTER: 'createAccount',
  REGISTER_RES: 'accountCreated',
  DISCONNECT: 'disconnect',

  GET_ROOMS: 'getRooms',
  GET_SPECTATE_ROOMS: 'getSpectateRooms',
  SELECT_ROOM: 'selectRoom',
  SELECT_SPECTATE_ROOM: 'selectSpectateRoom',
  DISCONNECT_ROOM: 'disconnectRoom',

  HOLE_CARDS: 'holeCards',
  ROOM_PARAM: 'roomParams',
  STATUS_UPDATE: 'statusUpdate',
  LAST_USER_ACTION: 'lastUserAction',
  ALL_PLAYERS_CARDS: 'allPlayersCards',

  SET_FOLD: 'setFold',
  SET_CHECK: 'setCheck',
  SET_RAISE: 'setRaise',

  FLOP: 'theFlop',
  TURN: 'theTurn',
  RIVER: 'theRiver',
};

export const SUPER_PLAYERS = {
  s1: 'super_player_1',
  s2: 'super_player_2',
};

export const WEBSOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'ws://127.0.0.1:8000';
