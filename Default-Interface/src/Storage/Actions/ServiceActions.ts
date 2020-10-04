import {ServiceActionsTypes} from '../../Interfaces/ActionsInterface';

export const toggleMakeRecording = () => ({
  type: ServiceActionsTypes.TOGGLE_MAKE_RECORD,
});

export const setFlagConnection = () => ({
  type: ServiceActionsTypes.TOGGLE_CONNECTION,
});
