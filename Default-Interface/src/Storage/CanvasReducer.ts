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

const defaultD3Poit = {
  x: 0,
  y: 0,
  z: 0
}
const D2_TO_D3 = (pointersType: PointersType, point: Point, template: D3_Point = defaultD3Poit) : D3_Point => {
  const {first, second} = point;
  
  switch(pointersType) {
    case PointersTypes.XY_axis: {
      return {...template, ...{x: first, y: second}};
    }
    case PointersTypes.YZ_axis: {
      return {...template, ...{y: first, z: second}};
    }
    case PointersTypes.ZX_axis: {
      return {...template, ...{z: first, x: second}};
    }
  }
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
      const newPoint = D2_TO_D3(pointType, data);

      return {...state, pointsArray: [...state.pointsArray, newPoint]}
    };
    case CanvasActionsTypes.CLEAR_CANVAS: {
      return {...initialState}
    }
    case CanvasActionsTypes.SET_POINT: {
      //сложный момент, нужно думать как лучше хранить точки
      //у хранения точек в массиве есть существенный недостаток - удалять точки очень запарно.
      //если просто сдвигать массив, то сдвинутся и индексы вершин, и тогда связи между ними будут потеряны.
      //решение - хранить в map с ключем индексом
      
      const {data, ind, pointType} = action.body;
      const {pointsArray} = state;
      
      if (pointsArray[ind] === undefined) {
        throw new Error("pointsArray[ind] === undefined");
      }

      pointsArray[ind] = D2_TO_D3(pointType, data, pointsArray[ind]);
      
      return {...state, pointsArray: [...pointsArray]}
    }
    default: {
      return state;
    }
  };
}

export function getPointArray(state: CanvasReducerStore, pointersType: PointersType): Array<Point> {
  return state.pointsArray.map((point) => D3_to_D2(pointersType, point) );
}
