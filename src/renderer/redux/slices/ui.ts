import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ui as initialUi } from 'renderer/redux/initialState';
import { IUi } from 'interfaces/common';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: initialUi,
    reducers: {
        setView: (state, action: PayloadAction<IUi['view']>) => {
            const newState = { ...state, view: action.payload };
            return newState;
        },
    },
});

export const { setView } = uiSlice.actions;

export default uiSlice.reducer;
