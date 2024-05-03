import { createSlice } from '@reduxjs/toolkit';
import { IRole } from 'src/types';

type initialStateType = {
    roles: IRole[];
};

const initialRoles: IRole[] = [];

const initialState: initialStateType = {
    roles: initialRoles,
};

const role = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRoles(state, action) {
            state.roles = action.payload;
        },
    },
});

export default role.reducer;

export const { setRoles } = role.actions;
