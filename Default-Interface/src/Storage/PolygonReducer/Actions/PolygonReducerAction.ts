import {PolygonPoint} from '../../../Interfaces/PolygonPointsInterface';
import {Action, setPolygonPointType} from './PolygonActionsInterface';

export const addPolygonPoint = (data: PolygonPoint = {x: 0, y: 0}) => ({
	type: Action.ADD_POINT,
	body: {
		data,
	},
});

export const dellPolygonPoint = () => ({
	type: Action.REMOVE_POINT,
});

export const setPolygonPoint: setPolygonPointType = (ind, data) => ({
	type: Action.SET_POINT,
	body: {
		data,
		ind,
	},
});

export const dropPolygonPoints = () => ({
	type: Action.DROP_POINTS,
});
