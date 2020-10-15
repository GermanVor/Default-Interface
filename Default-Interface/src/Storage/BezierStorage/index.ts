// import {ActionsType, CanvasActionsTypes} from './Actions/Main';
import * as actions from '../Actions/BezierActions';
import {Point} from '../../Interfaces/BezierActionsInterface';
import {Action} from '../../Interfaces/BezierActionsInterface';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type ActionsType = ReturnType<InferValueTypes<typeof actions>>;

export interface StateType {
  points: Array<Point>;
}

const initialState: StateType = {
  points: [
    {x: 150, y: 90},
    {x: 250, y: 170},
    {x: 470, y: 60},
  ],
};

export function BezierReducer(state: StateType = initialState, action: ActionsType): StateType {
  switch (action.type) {
    case Action.ADD_POINT: {
      return {...state, points: [...state.points, action.body.data]};
    }
    case Action.SET_POINT: {
      const {data, ind} = action.body;
      const clone = [...state.points];

      clone[ind] = data;
      return {...state, points: [...clone]};
    }
    case Action.REMOVE_POINT: {
      if (state.points.length > 3) {
        const clone = [...state.points];
        clone.pop();
        return {...state, points: clone};
      } else {
        return state;
      }
    }
    default: {
      return state;
    }
  }
}

export const getPoint = (state: StateType, ind: number): Point => {
  if (state.points[ind] === undefined) throw Error('state.points[ind] === undefined');
  else {
    return {...state.points[ind]};
  }
};
