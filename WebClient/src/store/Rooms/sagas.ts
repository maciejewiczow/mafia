import { toast } from 'react-toastify';
import { api, GameOptions, GameRoom } from 'api';
import { AxiosResponse } from 'axios';
import { replace } from 'redux-first-history';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { AppState } from 'store/constants';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import { PickAction } from 'store/utils';
import {
    createRoomSuccess,
    getCurrentRoomSuccess,
    joinRoomSuccess,
} from './actions';
import { RoomsAction, RoomsActionType } from './constants';

function* createRoomWatcher() {
    yield takeLatest(RoomsActionType.createRoom, createRoomWorker);
}

function* createRoomWorker({
    name,
}: PickAction<RoomsAction, RoomsActionType.createRoom>) {
    try {
        const result: AxiosResponse<GameRoom> = yield call(
            api.post,
            '/gameRooms',
            { name },
        );

        yield put(createRoomSuccess(result));
        yield put(replace('room'));
    } catch (e) {
        console.error('Room creation failed', e);
        toast.error('Podczas tworzenia pokoju wystąpił błąd');
    }
}

function* joinRoomWatcher() {
    yield takeLatest(RoomsActionType.joinRoom, joinRoomWorker);
}

function* joinRoomWorker(
    action: PickAction<RoomsAction, RoomsActionType.joinRoom>,
) {
    try {
        const room: AxiosResponse<GameRoom> = yield call(
            api.post,
            `/gameRooms/${action.roomId}/join`,
        );

        yield put(joinRoomSuccess(room));
        yield put(replace('room'));
    } catch (error) {
        console.error('Joining room failed with error: ', error);
        if (error instanceof Error) {
            toast.error(
                `Podczs dołączania do pokoju wystąpił błąd: ${error.message}`,
            );
        }
    }
}

export function* getCurrentRoomWorker() {
    const isUserInAnyRoom: string | undefined = yield select(
        userSelectors.currentUserRoom,
    );
    if (!isUserInAnyRoom) {
        return;
    }

    try {
        put({ type: RoomsActionType.getCurrentRoom });
        const room: AxiosResponse<GameRoom> = yield call(
            api.get,
            '/gameRooms/current',
        );

        yield put(getCurrentRoomSuccess(room));
        const hasGameStarted: boolean | undefined = yield select(
            roomSelectors.hasCurrentGameStarted,
        );
        const path: string | undefined = yield select(
            (state: AppState) => state.router.location?.pathname,
        );

        if (path === '/') {
            if (!hasGameStarted) {
                yield put(replace('room'));
            } else {
                yield put(replace('game'));
            }
        }

        if (path === '/room' && hasGameStarted) {
            yield put(replace('game'));
        }
    } catch (error) {
        console.log('Current room request failed with error: ', error);
        if (error instanceof Error) {
            toast.error(`Błąd rządania: ${error.message}`);
        }
    }
}

function* saveRoomOptionsWatcher() {
    yield takeLatest(RoomsActionType.saveRoomSettings, saveRoomOptionsWorker);
}

function* saveRoomOptionsWorker() {
    const currentRoomId: string | undefined = yield select(
        (state: AppState) => state.rooms.currentRoom?.id,
    );

    if (!currentRoomId) {
        return;
    }

    const currentRoomOpts: GameOptions | undefined = yield select(
        roomSelectors.currentRoomOptions,
    );

    if (!currentRoomOpts) {
        return;
    }

    try {
        yield call(
            api.put,
            `/gameRooms/${currentRoomId}/options`,
            currentRoomOpts,
        );
        toast.success('Ustawienia zapisano pomyślnie');
    } catch (e) {
        toast.error('Przy zapisywaniu ustawień wystąpił błąd');
        console.log(e);
    }
}

export default {
    createRoomWatcher,
    joinRoomWatcher,
    saveRoomOptionsWatcher,
};
