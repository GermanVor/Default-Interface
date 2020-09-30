import * as actions from './Actions/ServiceActions'
import {Point} from '../Interfaces/CanvasInterface'
import {ServiceActionsTypes} from '../Interfaces/ActionsInterface'

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;
type ReducerActions = ReturnType<InferValueTypes<typeof actions>>;

export interface ServiceReducerStore {
    isRecording: boolean
}

const initialState: ServiceReducerStore = {
    isRecording: false
}

export function ServiceReducer(state: ServiceReducerStore = initialState, action: ReducerActions): ServiceReducerStore {
  switch (action.type) {
    case ServiceActionsTypes.TOGGLE_MAKE_RECORD: {
      return {...state, isRecording: !state.isRecording}
    }
    default: {
      return state;
    }
  };
}