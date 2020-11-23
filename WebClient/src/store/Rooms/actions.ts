import { ActionCreator } from 'redux';
import { RoomsResponse } from '../../api';
import { RequestActionBundle } from '../utils';

export enum RoomsActionType {
    roomsRequest = 'rooms/REQUEST',
    roomsRequestSuccess = 'rooms/REQUEST_SUCCESS',
    roomsRequestFailed = 'rooms/REQUEST_FAILED',
}

export type RoomsAction = RequestActionBundle<
RoomsActionType.roomsRequest,
RoomsActionType.roomsRequestSuccess,
RoomsActionType.roomsRequestFailed,
void,
RoomsResponse
>;

export const getRooms: ActionCreator<RoomsAction> = () => ({
    type: RoomsActionType.roomsRequest,
    payload: {
        request: {
            url: '/GameRooms'
        }
    }
});
