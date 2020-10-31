import {Point} from '../../Interfaces/BezierActionsInterface';
import {Action} from '../../Interfaces/BezierActionsInterface';
import {PointersTypesInterface} from '../../Interfaces/CommonInterface';

export const addPoint = (data: Point = {x: 0, y: 0, z: 0}) => ({
  type: Action.ADD_POINT,
  body: {
    data,
  },
});

export const dellPoint = () => ({
  type: Action.REMOVE_POINT,
});

export const setPoint = (
  axisType: PointersTypesInterface,
  ind_1: number,
  ind_2: number,
  first: number,
  second: number,
) => ({
  type: Action.SET_POINT,
  body: {
    axisType,
    ind_1,
    ind_2,
    first,
    second,
  },
});
