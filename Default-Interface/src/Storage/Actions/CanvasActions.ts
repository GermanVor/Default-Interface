import {Point} from '../../Interfaces/CanvasInterface';
import {CanvasActionsTypes} from '../../Interfaces/ActionsInterface';
import {PointersType} from '../../Interfaces/CanvasInterface';

export const addPoint = (data: Point, pointType: PointersType) => ({
  type: CanvasActionsTypes.ADD_POINT,
  body: {
    pointType,
    data,
  },
});

export const setPoint = (data: Point, pointType: PointersType, ind: number) => ({
  type: CanvasActionsTypes.SET_POINT,
  body: {
    pointType,
    data,
    ind,
  },
});

export const setConnection = (secondTop: number) => ({
  type: CanvasActionsTypes.SET_CONNECTION,
  body: {
    secondTop,
  },
});

export const clearPoints = () => ({
  type: CanvasActionsTypes.CLEAR_CANVAS,
});

export const setPotentialToConnectPoint = (ind: number) => ({
  type: CanvasActionsTypes.SET_POTENTIAL_POINT,
  body: {
    ind,
  },
});

export const dropPotentialToConnectPoint = () => ({
  type: CanvasActionsTypes.DROP_POTENTIAL_POINT,
});