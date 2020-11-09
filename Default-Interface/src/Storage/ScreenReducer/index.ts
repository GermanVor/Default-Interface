import * as actions from './Action/ScreenReducerAction';
import {ScreenPoint} from '../../Interfaces/PolygonPointsInterface';
import {Action} from './Action/ScreenActionsInterface';

type InferValueTypes<T> = T extends {[key: string]: infer U} ? U : never;
type ActionsType = ReturnType<InferValueTypes<typeof actions>>;

export type StateType = {
    screenPoint: Array<ScreenPoint>;
};

const getInitialScreenPoints = (): Array<ScreenPoint> =>
    [
        {x: 100, y: 150},
        {x: 570, y: 150},
        {x: 570, y: 350},
        {x: 100, y: 350},
    ].map((point) => ({...point}));

export const initialState: StateType = {
    screenPoint: getInitialScreenPoints(),
};

export function ScreenReducer(state: StateType = initialState, action: ActionsType): StateType {
    switch (action.type) {
        case Action.SET_POINT: {
            const {ind, data} = action.body;

            state.screenPoint[ind] = {...data};
            return {...state, screenPoint: [...state.screenPoint]};
        }
        case Action.REMOVE_POINT: {
            const {screenPoint} = state;

            if (screenPoint.length > 3) {
                screenPoint.pop();
                return {...state, screenPoint: [...state.screenPoint]};
            }
        }
        case Action.DROP_POINTS: {
            return {...state, screenPoint: getInitialScreenPoints()};
        }
        case Action.ADD_POINT: {
            const {screenPoint} = state;

            screenPoint.push({x: 0, y: 0});
            return {...state, screenPoint: [...state.screenPoint]};
        }
        default: {
            return state;
        }
    }
}
