import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { ChatTypeEnum } from 'api';
import { connectToGame, startGame } from 'store/Game/actions';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
import Button from 'react-bootstrap/esm/Button';
import { ViewWrapper } from '../ViewWrapper';
import {
    Header,
    StartGameButtonWrapper,
    ContentWrapper,
    ParticipantsWrapper,
    Participant,
    Badge,
    ChatArea,
    SettingsButton,
} from './parts';
import { Settings } from './Settings';

const GameRoomView: React.FC = () => {
    const dispatch = useDispatch();
    const room = useSelector(roomSelectors.currentRoom);
    const isCurrentRoomLoading = useSelector(roomSelectors.isCurrentRoomLoading);
    const currentUser = useSelector(userSelectors.currentUser);
    const isConnectedToGame = useSelector(gameSelectors.isConnectedToGame);
    const isConnectingToGame = useSelector(gameSelectors.isConnectingToGame);

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);

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
                    <StartGameButtonWrapper>
                        <Button
                            variant="primary"
                            onClick={handleStartGameClick}
                            disabled={!isConnectedToGame || isConnectingToGame || room.participants.length < 3}
                            title={room.participants.length < 3 ? 'Wymagane jest minimum 3 graczy' : ''}
                        >
                          Rozpocznij grę
                        </Button>
                        <SettingsButton
                            onClick={() => setAreSettingsOpen(state => !state)}
                            title="Ustawienia gry"
                        />
                    </StartGameButtonWrapper>
                )}
            </Header>
            <ContentWrapper areSettingsOpen={areSettingsOpen}>
                <ParticipantsWrapper>
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
                </ParticipantsWrapper>
                <ChatArea chatType={ChatTypeEnum.General} />
                {areSettingsOpen && (
                    <Settings />
                )}
            </ContentWrapper>
        </ViewWrapper>
    );
};

export default GameRoomView;
