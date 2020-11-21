import {StartWeilerAthertonAlgoritm, AlgoritmResult} from '../../Functions/Algoritm';
import {initialState as polygonInitialState} from '../PolygonReducer/index';
import {initialState as ScreeninitialState} from '../ScreenReducer/index';

import {Action} from './Action/interface';
import * as actions from './Action/ResultReducerAction';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type ActionsType = ReturnType<InferValueTypes<typeof actions>>;

export type StateType = {
	resultArr: AlgoritmResult;
};

const initialState: StateType = {
	resultArr: StartWeilerAthertonAlgoritm(polygonInitialState.polygonPoints, ScreeninitialState.screenPoint),
};

export function ResultReducer(state: StateType = initialState, action: ActionsType): StateType {
	switch (action.type) {
		case Action.SET_STATE: {
			const {polygonPoints, screenPoints} = action.data;

			return {...state, resultArr: StartWeilerAthertonAlgoritm(polygonPoints, screenPoints)};
		}
		default: {
			return state;
		}
	}
}
