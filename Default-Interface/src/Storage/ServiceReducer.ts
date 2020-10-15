import * as actions from './Actions/ServiceActions';
import {Point} from '../Interfaces/CanvasInterface';
import {ServiceActionsTypes} from '../Interfaces/FirstLabActionsInterface';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type ReducerActions = ReturnType<InferValueTypes<typeof actions>>;

export interface ServiceReducerStore {
  isRecording: boolean;
  isConnection: boolean;
}

const initialState: ServiceReducerStore = {
  isRecording: false,
  isConnection: false,
};

export function ServiceReducer(state: ServiceReducerStore = initialState, action: ReducerActions): ServiceReducerStore {
  switch (action.type) {
    case ServiceActionsTypes.TOGGLE_MAKE_RECORD: {
      return {...state, isRecording: !state.isRecording};
    }
    case ServiceActionsTypes.TOGGLE_CONNECTION: {
      return {...state, isConnection: !state.isConnection};
    }
    default: {
      return state;
    }
  }
}
