import { combineReducers } from 'redux';
import ui from 'renderer/redux/slices/ui';
import data from 'renderer/redux/slices/data';

const rootReducer = combineReducers({ ui, data });

export default rootReducer;
