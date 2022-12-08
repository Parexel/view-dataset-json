import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { data as initialData } from 'renderer/redux/initialState';
import { IData } from 'interfaces/common';

export const dataSlice = createSlice({
    name: 'data',
    initialState: initialData,
    reducers: {
        setData: (state, action: PayloadAction<IData>) => {
            const newState = { ...state, name: action.payload.name };
            return newState;
        },
    },
});

export const { setData } = dataSlice.actions;

export default dataSlice.reducer;
