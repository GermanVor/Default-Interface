import {ScreenPoint} from '../../../Interfaces/PolygonPointsInterface';

export const Action = <const>{
	SET_POINT: 'SET_SCREEN_POINT',
	ADD_POINT: 'ADD_SCREEN_POINT',
	REMOVE_POINT: 'REMOVE_SCREEN_POINT',
	DROP_POINTS: 'DROP_SCREEN_POINTS',
};

export type setScreenPointType = (
	ind: number,
	data: ScreenPoint
) => {
	type: typeof Action.SET_POINT;
	body: {
		ind: number;
		data: ScreenPoint;
	};
};
