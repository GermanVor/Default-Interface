// import {CanvasReducerActions, CanvasActionsTypes} from './Actions/Main';
import * as actions from './Actions/CanvasActions';
import {D3_Point, Point} from '../Interfaces/CanvasInterface';
import {CanvasActionsTypes} from '../Interfaces/FirstLabActionsInterface';
import {PointersTypes} from '../Interfaces/CanvasInterface';
import {PointersType} from '../Interfaces/CanvasInterface';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type CanvasReducerActions = ReturnType<InferValueTypes<typeof actions>>;

type pointsType = Map<number, D3_Point>;
type connectionsType = Map<number, number>;

export interface CanvasReducerStore {
  points: pointsType;
  connections: connectionsType;
  potentialToConnectPoint: number | undefined;
}

const initialState: CanvasReducerStore = {
  points: new Map(),
  connections: new Map(),
  potentialToConnectPoint: undefined,
};

const defaultD3Poit = {
  x: 0,
  y: 0,
  z: 0,
};

const getFreeKey = (map: pointsType | connectionsType): number => {
  let i = 0;

  while (map.has(i)) {
    i++;
  }

  return i;
};

export const getGeneralIndex = (x: number, y: number): number => {
  if (x === y) throw new Error(`getGeneralIndex: x===y ${x} `);

  if (x < y) {
    const buf = x;
    x = y;
    y = buf;
  }

  y++;
  x++;

  return y + (x * (x - 1)) / 2 - x;
};

const D2_TO_D3 = (pointersType: PointersType, point: Point, template: D3_Point = defaultD3Poit): D3_Point => {
  point.first = Math.floor(point.first);
  point.second = Math.floor(point.second);

  const {first, second} = point;

  switch (pointersType) {
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
};

const D3_to_D2 = (pointersType: PointersType, point: D3_Point): Point => {
  const {x, y, z} = point;
  switch (pointersType) {
    case PointersTypes.XY_axis: {
      return {first: x, second: y};
    }
    case PointersTypes.YZ_axis: {
      return {first: y, second: z};
    }
    case PointersTypes.ZX_axis: {
      return {first: z, second: x};
    }
  }
};
export function CanvasReducer(
  state: CanvasReducerStore = initialState,
  action: CanvasReducerActions,
): CanvasReducerStore {
  const pointsFreeKey = getFreeKey(state.points);

  switch (action.type) {
    case CanvasActionsTypes.ADD_POINT: {
      const {data, pointType} = action.body;
      const newPoint = D2_TO_D3(pointType, data);

      state.points.set(pointsFreeKey, newPoint);

      return {...state, points: new Map(state.points)};
    }
    case CanvasActionsTypes.CLEAR_CANVAS: {
      return {
        ...initialState,
        connections: new Map(),
        points: new Map(),
      };
    }
    case CanvasActionsTypes.SET_POINT: {
      const {data, ind, pointType} = action.body;
      const {points} = state;

      if (!points.has(ind)) {
        throw new Error('SET_POINT: points.has(ind) === false');
      }

      points.set(ind, D2_TO_D3(pointType, data, points.get(ind)));

      return {...state, points: new Map(points)};
    }
    case CanvasActionsTypes.REMOVE_POINT: {
      const {ind} = action.body;
      const {points, connections, potentialToConnectPoint} = state;

      if (!points.has(ind)) {
        throw new Error('REMOVE_POINT: points.has(ind) === false');
      }

      points.delete(ind);

      for (const [i] of points) {
        if (i !== ind) {
          const helperInd = getGeneralIndex(i, ind);
          if (connections.has(helperInd)) {
            connections.delete(helperInd);
          }
        }
      }

      return {
        ...state,
        points: new Map(points),
        connections: new Map(connections),
        potentialToConnectPoint: potentialToConnectPoint === ind ? undefined : potentialToConnectPoint,
      };
    }
    case CanvasActionsTypes.SET_DROP_CONNECTION: {
      const {secondTop} = action.body;
      const {connections, potentialToConnectPoint} = state;
      const ind = getGeneralIndex(potentialToConnectPoint!, secondTop);

      if (potentialToConnectPoint === undefined) {
        throw new Error('case CanvasActionsTypes.SET_DROP_CONNECTION: potentialToConnectPoint == undefined');
      }

      if (potentialToConnectPoint !== secondTop) {
        if (connections.has(ind)) {
          connections.delete(ind);
        } else {
          connections.set(ind, 1);
        }

        return {...state, connections: new Map(connections)};
      } else {
        return state;
      }
    }
    case CanvasActionsTypes.SET_POTENTIAL_POINT: {
      if (action.body.ind === state.potentialToConnectPoint) {
        return {...state, potentialToConnectPoint: undefined};
      } else {
        return {...state, potentialToConnectPoint: action.body.ind};
      }
    }
    case CanvasActionsTypes.DROP_POTENTIAL_POINT: {
      return {...state, potentialToConnectPoint: undefined};
    }
    default: {
      return state;
    }
  }
}

type pointsTypeD2 = Map<number, Point>;

export function getPoint(state: CanvasReducerStore, pointersType: PointersType): pointsTypeD2 {
  const res: pointsTypeD2 = new Map();

  for (const [i, point] of state.points) {
    res.set(i, D3_to_D2(pointersType, point));
  }

  return res;
}

export function isConnection(state: CanvasReducerStore, indA: number, indB: number): boolean {
  return Boolean(state.connections.get(getGeneralIndex(indA, indB)));
}
