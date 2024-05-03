import { createSlice } from '@reduxjs/toolkit';
import { IUser } from 'src/types';

type initialStateType = {
  token: string;
  user: IUser;
  isLoggedIn: boolean;
  loading: boolean;
};

const initialUser: IUser = {
  "id": 1,
  "name": "",
  "email": "",
  "password": "",
  "xp": 0,
  "money": "",
  "agent_code": 0,
  "win_count": 0,
  "lose_count": 0,
  "rew_ad_count": 0,
  "status": true,
  "role_id": 6,
  "createdAt": "",
  "updatedAt": ""
};

const initialState: initialStateType = {
  token: '',
  user: initialUser,
  isLoggedIn: false,
  loading: false,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setbalance(state, action) {
      state.user.money = action.payload;
    },

    signin(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.loading = false;
    },

    edit(state, action) {
      state.user = action.payload;
    },

    signout(state) {
      state.token = '';
      state.user = initialUser;
      state.isLoggedIn = false;
    },
  },
});

export default auth.reducer;

export const { signin, signout, edit, setbalance } = auth.actions;
