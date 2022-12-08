export interface IUi {
    view: 'select' | 'view';
}

export interface IData {
    name: null | string;
}

export interface IStore {
    ui: IUi;
    data: IData;
}
