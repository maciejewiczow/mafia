import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { ChatTypeEnum } from 'api';
import { connectToGame, startGame } from 'store/Game/actions';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
import { ViewWrapper } from '../ViewWrapper';
import {
    Header,
    StartGameButton,
    ContentWrapper,
    Participants,
    Participant,
    Badge,
    ChatArea,
} from './parts';

const GameRoomView: React.FC = () => {
    const dispatch = useDispatch();
    const room = useSelector(roomSelectors.currentRoom);
    const isCurrentRoomLoading = useSelector(roomSelectors.isCurrentRoomLoading);
    const currentUser = useSelector(userSelectors.currentUser);
    const isConnectedToGame = useSelector(gameSelectors.isConnectedToGame);
    const isConnectingToGame = useSelector(gameSelectors.isConnectingToGame);

    useEffect(() => {
        if (!isConnectingToGame && !isConnectedToGame && room)
            dispatch(connectToGame());
    }, [
        dispatch,
        isConnectedToGame,
        isConnectingToGame,
        room,
    ]);

    if (!room && !isCurrentRoomLoading)
        return <Redirect to="/" />;

    if (!room)
        return <div>Loading room...</div>;

    if (room.hasGameStarted && !room.hasGameEnded)
        return <Redirect to="/game" />;

    const handleStartGameClick = () => {
        dispatch(startGame());
    };

    return (
        <ViewWrapper>
            <Header>
                {room.name}
                {(room.owner === currentUser?.id && !room.hasGameEnded) && (
                    <StartGameButton
                        onClick={handleStartGameClick}
                        disabled={!isConnectedToGame || isConnectingToGame}
                    >
                      Rozpocznij grę
                    </StartGameButton>
                )}
            </Header>
            <ContentWrapper>
                <Participants>
                    <h3>Uczestnicy gry</h3>
                    {room.participantsWithNames.map(user => (
                        <Participant key={user.id}>
                            {user.name}
                            {' '}
                            {(user.id === currentUser?.id) && <Badge>(ty)</Badge>}
                            {' '}
                            {(user.id === room.owner) && <Badge>(właściel)</Badge>}
                        </Participant>
                    ))}
                </Participants>
                <ChatArea chatType={ChatTypeEnum.General} />
            </ContentWrapper>
        </ViewWrapper>
    );
};

export default GameRoomView;
