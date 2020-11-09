import {combineReducers} from 'redux';
import {PolygonReducer} from './PolygonReducer';
import {ScreenReducer} from './ScreenReducer';
import {ResultReducer} from './ResultReducer';

const rootReducer = combineReducers({
    PolygonReducer,
    ScreenReducer,
    ResultReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
