import {PolygonPoint} from '../../../Interfaces/PolygonPointsInterface';

export const Action = <const>{
    ADD_POINT: 'ADD_POLYGON_POINT',
    DROP_POINTS: 'DROP_POLYGON_CANVAS',
    SET_POINT: 'SET_POLYGON_POINT',
    REMOVE_POINT: 'REMOVE_POLYGON_POINT',
};

export type setPolygonPointType = (
    ind: number,
    data: PolygonPoint,
) => {
    type: typeof Action.SET_POINT;
    body: {
        ind: number;
        data: PolygonPoint;
    };
};
