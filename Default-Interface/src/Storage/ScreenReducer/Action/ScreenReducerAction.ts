import {Action, setScreenPointType} from './ScreenActionsInterface';

export const setScreenPoint: setScreenPointType = (ind, data) => ({
    type: Action.SET_POINT,
    body: {
        ind,
        data,
    },
});
