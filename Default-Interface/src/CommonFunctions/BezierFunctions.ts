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

export const getBezierGrid = (
  BezierBazis: Array<Array<Point>>, 
  size_x: number = 12, 
  size_z: number = 12
): Array<Array<Point>> => {
  const arrayPointsToDraw: Array<Array<Point>> = [];
  
  // ki = [0, 1]    kj = [0, 1]
  for (let ki = 0; ki < 1 + 1/size_x; ki += 1/size_x) {
    const arr: Array<Point> = [];

    for (let kj = 0; kj < 1 + 1/size_x; kj += 1/size_z) {

      const k = arr.push({x: 0, y: 0, z: 0}) - 1;

      BezierBazis.forEach( (pointsA, i) => {
        const N_1 = getBezierBasis(i, BezierBazis.length - 1, ki);

        pointsA.forEach( (point, j) => {
          const N_2 = getBezierBasis(j, pointsA.length - 1, kj);

          arr[k].x += point.x * N_1 * N_2;
          arr[k].y += point.y * N_1 * N_2;
          arr[k].z += point.z * N_1 * N_2;
        });
      });
    };
    arrayPointsToDraw.push(arr);
  };

  return arrayPointsToDraw;
};
