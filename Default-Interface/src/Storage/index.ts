import {combineReducers} from 'redux';
import {BezierReducer} from './BezierStorage';

const rootReducer = combineReducers({
  BezierReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
