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
	resultArr: <AlgoritmResult>(
		StartWeilerAthertonAlgoritm(polygonInitialState.polygonPoints, ScreeninitialState.screenPoint)
	),
};

export function ResultReducer(state: StateType = initialState, action: ActionsType): StateType {
	switch (action.type) {
		case Action.SET_STATE: {
			const {polygonPoints, screenPoints, isUnion, isСonjunction} = action.data;

			const resultArr = StartWeilerAthertonAlgoritm(polygonPoints, screenPoints, isUnion, isСonjunction);
			if (resultArr !== false) {
				return {...state, resultArr};
			}
		}
		default: {
			return state;
		}
	}
}
