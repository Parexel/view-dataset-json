import { combineReducers } from 'redux';
import ui from 'renderer/redux/slices/ui';

const rootReducer = combineReducers({ ui });

export default rootReducer;
