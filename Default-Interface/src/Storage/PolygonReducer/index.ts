import * as actions from './Actions/PolygonReducerAction';
import {PolygonPoint} from '../../Interfaces/PolygonPointsInterface';
import {Action} from './Actions/PolygonActionsInterface';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type ActionsType = ReturnType<InferValueTypes<typeof actions>>;

export type StateType = {
	polygonPoints: Array<PolygonPoint>;
};

const getInitialPolygonPoints = (): Array<PolygonPoint> =>
	[
		{x: 100, y: 170},
		{x: 370, y: 190},
		{x: 350, y: 400},
	].map((point) => ({...point}));

export const initialState: StateType = {
	polygonPoints: getInitialPolygonPoints(),
};

export function PolygonReducer(state: StateType = initialState, action: ActionsType): StateType {
	switch (action.type) {
		case Action.ADD_POINT: {
			const {data} = action.body;
			state.polygonPoints.push({...data});

			return {...state, polygonPoints: [...state.polygonPoints]};
		}
		case Action.SET_POINT: {
			const {ind, data} = action.body;
			state.polygonPoints[ind] = {...data};

			return {...state, polygonPoints: [...state.polygonPoints]};
		}
		case Action.DROP_POINTS: {
			return {...state, polygonPoints: getInitialPolygonPoints()};
		}
		case Action.REMOVE_POINT: {
			if (state.polygonPoints.length > 3) {
				state.polygonPoints.pop();
				return {...state, polygonPoints: [...state.polygonPoints]};
			}
		}
		default: {
			return state;
		}
	}
}
