export const Action = <const>{
  ADD_POINT: 'ADD_POINT_B',
  CLEAR_POINTS: 'CLEAR_CANVAS_B',
  SET_POINT: 'SET_POINT_B',
  REMOVE_POINT: 'REMOVE_POINT_B',
  SET_STEP: 'SET_STEP_B',
};

export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface SimplePoint {
  x: number;
  y: number;
}

export type PointsArray = Array<Array<Point>>;
