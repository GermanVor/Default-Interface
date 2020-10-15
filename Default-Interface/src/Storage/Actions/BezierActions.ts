import {SSL_OP_SSLEAY_080_CLIENT_DH_BUG} from 'constants';
import {Point} from '../../Interfaces/BezierActionsInterface';
import {Action} from '../../Interfaces/BezierActionsInterface';

export const addPoint = (data: Point = {x: 0, y: 0}) => ({
  type: Action.ADD_POINT,
  body: {
    data,
  },
});

export const dellPoint = () => ({
  type: Action.REMOVE_POINT,
});

export const setPoint = (data: Point, ind: number) => ({
  type: Action.SET_POINT,
  body: {
    data,
    ind,
  },
});
