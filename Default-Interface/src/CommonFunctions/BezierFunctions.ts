import {Point} from '../Interfaces/BezierActionsInterface';

const BEZIER_DRAW_STEP = 0.01;

const getBezierBasis = (i: number, n: number, t: number): number => {
  const factor = (i: number): number => {
    return i <= 1 ? 1 : i * factor(i - 1);
  };

  return (factor(n) / (factor(i) * factor(n - i))) * Math.pow(t, i) * Math.pow(1 - t, n - i);
};

export const getBezierLinesPoints = (points: Array<Point>): Array<Point> => {
  const arrayPointsToDraw: Array<Point> = [];

  for (let t = 0; t < 1 + BEZIER_DRAW_STEP; t += BEZIER_DRAW_STEP) {
    const k = arrayPointsToDraw.push({x: 0, y: 0, z: 0}) - 1;
    for (let i = 0; i < points.length; i++) {
      const N = getBezierBasis(i, points.length - 1, t);

      arrayPointsToDraw[k].x += points[i].x * N;
      arrayPointsToDraw[k].y += points[i].y * N;
      arrayPointsToDraw[k].z += points[i].z * N;
    }
  }

  return arrayPointsToDraw;
};
