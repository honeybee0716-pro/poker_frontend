import { createSlice } from '@reduxjs/toolkit';
import { IUser } from 'src/types';

type initialStateType = {
  token: string;
  user: IUser;
  isLoggedIn: boolean;
  loading: boolean;
  cash_buy_money : any;
};

const initialUser: IUser = {
  id: 1,
  name: '',
  email: '',
  password: '',
  xp: 0,
  money: '',
  agent_code: 0,
  win_count: 0,
  lose_count: 0,
  rew_ad_count: 0,
  status: true,
  role_id: 6,
  createdAt: '',
  updatedAt: '',
  player_role: '',
};

const initialState: initialStateType = {
  token: '',
  user: initialUser,
  isLoggedIn: false,
  loading: false,
  cash_buy_money : 0
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setbalance(state, action) {
      console.log('Updating balance to:', action.payload); // Debugging line
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

    setCashBuyIn(state, action) {
      console.log('Updating cash buy in balance to:', action.payload);
      state.cash_buy_money = action.payload;
    }
  },
});

export default auth.reducer;

export const { signin, signout, edit, setbalance, setCashBuyIn } = auth.actions;
