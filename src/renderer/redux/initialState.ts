import { IStore, IUi } from 'interfaces/common';

export const ui: IUi = {
    view: 'table',
};

const initialState: IStore = {
    ui,
};

export default initialState;
