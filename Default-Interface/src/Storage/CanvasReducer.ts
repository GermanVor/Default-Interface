// import {CanvasReducerActions, CanvasActionsTypes} from './Actions/Main';
import * as actions from './Actions/CanvasActions'
import {D3_Point, Point} from '../Interfaces/CanvasInterface';
import {CanvasActionsTypes} from '../Interfaces/ActionsInterface';
import {PointersTypes} from '../Interfaces/CanvasInterface';
import {PointersType} from '../Interfaces/CanvasInterface';

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;
type CanvasReducerActions = ReturnType<InferValueTypes<typeof actions>>;

export interface CanvasReducerStore {
  pointsArray: Array<D3_Point>
}

const initialState: CanvasReducerStore = {
    pointsArray: []
}

const D3_to_D2 = (pointersType: PointersType, point: D3_Point) : Point => {
  const {x, y, z} = point;
  switch(pointersType) {
    case PointersTypes.XY_axis: {
      return {first: x, second: y};
    }
    case PointersTypes.YZ_axis: {
      return {first: y, second: z}
    }
    case PointersTypes.ZX_axis: {
      return {first: z, second: x}
    }
  }
}
export function CanvasReducer(state: CanvasReducerStore = initialState, action: CanvasReducerActions): CanvasReducerStore {
  switch (action.type) {
    case CanvasActionsTypes.ADD_POINT: {
      const {data, pointType} = action.body;
      switch (pointType) {
        case PointersTypes.XY_axis: {
          const point: D3_Point = {
            x: data.first,
            y: data.second,
            z: 0
          }
          return {...state, pointsArray: [...state.pointsArray, point]}
        }
        case PointersTypes.YZ_axis: {
          const point: D3_Point = {
            x: 0,
            y: data.first,
            z: data.second
          }
          return {...state, pointsArray: [...state.pointsArray, point]}
        }
        case PointersTypes.ZX_axis: {
          const point: D3_Point = {
            x: data.second,
            y: 0,
            z: data.first
          }
          return {...state, pointsArray: [...state.pointsArray, point]}
        }
      };
    };
    case CanvasActionsTypes.CLEAR_CANVAS: {
      return {...initialState}
    }
    default: {
      return state;
    }
  };
}

export function getPointArray(state: CanvasReducerStore, pointersType: PointersType): Array<Point> {
  return state.pointsArray.map((point) => D3_to_D2(pointersType, point) );
}
