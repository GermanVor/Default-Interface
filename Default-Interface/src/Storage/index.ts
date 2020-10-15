import {combineReducers} from 'redux';

import {CanvasReducer} from './CanvasReducer';
import {ServiceReducer} from './ServiceReducer';

const rootReducer = combineReducers({
  CanvasReducer,
  ServiceReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
