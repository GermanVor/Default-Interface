import {Action, setScreenPointType} from './ScreenActionsInterface';

export const setScreenPoint: setScreenPointType = (ind, data) => ({
	type: Action.SET_POINT,
	body: {
		ind,
		data,
	},
});

export const addScreenPoint = () => ({
	type: Action.ADD_POINT,
});

export const dropScreenPoints = () => ({
	type: Action.DROP_POINTS,
});

export const dellScreenPoint = () => ({
	type: Action.REMOVE_POINT,
});
