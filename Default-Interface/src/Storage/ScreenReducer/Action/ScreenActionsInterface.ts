import {ScreenPoint} from '../../../Interfaces/PolygonPointsInterface';

export const Action = <const>{
    SET_POINT: 'SET_SCREEN_POINT',
};

export type setScreenPointType = (
    ind: number,
    data: ScreenPoint,
) => {
    type: typeof Action.SET_POINT;
    body: {
        ind: number;
        data: ScreenPoint;
    };
};
