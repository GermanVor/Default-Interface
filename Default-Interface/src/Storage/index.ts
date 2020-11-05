import {combineReducers} from 'redux';
import {PolygonReducer} from './PolygonReducer';
import {ScreenReducer} from './ScreenReducer';

const rootReducer = combineReducers({
    PolygonReducer,
    ScreenReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
