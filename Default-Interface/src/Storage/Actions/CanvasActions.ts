import {Point} from '../../Interfaces/CanvasInterface';
import {CanvasActionsTypes} from '../../Interfaces/ActionsInterface';
import {PointersType} from '../../Interfaces/CanvasInterface';

export const addPoint = (data: Point, pointType: PointersType) => ({
  type: CanvasActionsTypes.ADD_POINT,
  body: {
    pointType, data
  }
})

export const clearPoints = () => ({
  type: CanvasActionsTypes.CLEAR_CANVAS,
})
