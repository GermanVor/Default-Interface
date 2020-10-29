export const PointersTypes = <const>{
  XY_axis: 'XY_axis',
  ZY_axis: 'ZY_axis',
  XZ_axis: 'XZ_axis'
};

export type PointersTypesInterface = typeof PointersTypes.XY_axis | typeof PointersTypes.XZ_axis | typeof PointersTypes.ZY_axis;

export type AxisOption = {
  name: string;
  type: typeof PointersTypes.XY_axis | typeof PointersTypes.ZY_axis;
};
