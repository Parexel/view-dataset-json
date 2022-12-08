import { IData, IStore, IUi } from 'interfaces/common';

export const ui: IUi = {
    view: 'select',
};

export const data: IData = {
    name: null,
};

const initialState: IStore = {
    ui,
    data,
};

export default initialState;
