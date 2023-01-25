export interface IUi {
    view: 'select' | 'view';
}

export interface IData {
    name: null | string;
    datasetNames: Array<string>;
}

export interface IStore {
    ui: IUi;
    data: IData;
}
