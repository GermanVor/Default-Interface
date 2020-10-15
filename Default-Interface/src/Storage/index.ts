import {combineReducers} from 'redux';

import {CanvasReducer} from './CanvasReducer';
import {ServiceReducer} from './ServiceReducer';
import {BezierReducer} from './BezierStorage';

const rootReducer = combineReducers({
  CanvasReducer,
  ServiceReducer,
  BezierReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
