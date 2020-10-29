// import {ActionsType, CanvasActionsTypes} from './Actions/Main';
import * as actions from '../Actions/BezierActions';
import {SimplePoint, Point, PointsArray} from '../../Interfaces/BezierActionsInterface';
import {Action} from '../../Interfaces/BezierActionsInterface';
import {PointersTypes, PointersTypesInterface} from '../../Interfaces/CommonInterface';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type ActionsType = ReturnType<InferValueTypes<typeof actions>>;

export type StateType = {
  points: PointsArray;
};

// Y
//    x
//Z
//

const baseLine = [
  {x: 20, y: 100, z: 20},
  {x: 20, y: 100, z: 20},
  {x: 20, y: 100, z: 20},
  {x: 20, y: 100, z: 20},
];

const delta = 65;
const pointsArray: PointsArray = [[], [], [], []];

pointsArray.forEach((points, i) => {
  baseLine.forEach((point, j) => {
    points.push({
      ...point,
      x: point.x + j*delta,
      z: point.z + i*delta
    });
  });
});

const initialState: StateType = {
  points: [...pointsArray],
};

export function BezierReducer(state: StateType = initialState, action: ActionsType): StateType {
  switch (action.type) {
    case Action.ADD_POINT: {
      state.points.forEach((arr, ind) => {
        const {data} = action.body;
        arr.push({...data, z: data.z + ind * 50});
      });

      return {...state, points: [...state.points]};
    }
    case Action.SET_POINT: {
      const {ind_1, ind_2, first, second, axisType} = action.body;

      const point = state.points[ind_1][ind_2];

      // меняет коориданты конкретной оси, третья координата остается неизменной 
      if (axisType === PointersTypes.XZ_axis) {
        point.x = first;
        point.z = second;
      } else if (axisType === PointersTypes.XY_axis) {
        point.x = first;
        point.y = second;
      } else if (axisType === PointersTypes.ZY_axis) {
        point.z = first;
        point.y = second;
      };

      state.points[ind_1] = [...state.points[ind_1]];
      state.points[ind_1][ind_2] = {...point};

      return {...state, points: [...state.points]};
    }
    case Action.REMOVE_POINT: {
      if (state.points.length > 3) {
        const clone = state.points.map((arr) => [...arr]);
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

export const getPoint = (state: StateType, axisType: PointersTypesInterface, ind_1: number, ind_2: number): SimplePoint => {
  if (state.points[ind_1][ind_2] === undefined) {
    throw Error('state.points[ind] === undefined');
  } else {
    const point = {...state.points[ind_1][ind_2]};

    switch (axisType) {
      case PointersTypes.XY_axis: {
        return {
          x: point.x,
          y: point.y
        };
      };
      case PointersTypes.XZ_axis: {
        return {
          x: point.x,
          y: point.z
        };
      };
      case PointersTypes.ZY_axis: {
        return {
          x: point.z,
          y: point.y
        }
      };
    };
  };
};
