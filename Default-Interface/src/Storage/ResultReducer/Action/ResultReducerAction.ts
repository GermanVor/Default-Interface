import {Action} from './interface';
import {PolygonPoint, ScreenPoint} from '../../../Interfaces/PolygonPointsInterface';

export const setState = (
	polygonPoints: Array<PolygonPoint>,
	screenPoints: Array<ScreenPoint>,
	isUnion: boolean = false,
	isСonjunction: boolean = false
) => ({
	type: Action.SET_STATE,
	data: {
		polygonPoints,
		screenPoints,
		isUnion,
		isСonjunction,
	},
});
