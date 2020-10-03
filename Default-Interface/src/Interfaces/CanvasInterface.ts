export interface Point {
  first: number;
  second: number;
}
export interface D3_Point {
  x: number;
  y: number;
  z: number;
}

export const PointersTypes = <const>{
  XY_axis: 'XY_axis',
  YZ_axis: 'YZ_axis',
  ZX_axis: 'ZX_axis',
};

export type PointersType = typeof PointersTypes.XY_axis | typeof PointersTypes.YZ_axis | typeof PointersTypes.ZX_axis;
