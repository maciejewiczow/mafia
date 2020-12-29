import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { Chat } from 'modules';
import { ChatTypeEnum } from 'api';
import { connectToGame, startGame } from 'store/Game/actions';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
import { ViewWrapper } from './ViewWrapper';

const Header = styled.header`
    background-color: #282c34;
    display: flex;
    font-size: calc(15px + 2vmin);
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 16px;

    position: relative;

    grid-area: header;
`;

const ContentWrapper = styled.div`
    grid-area: body;

    padding: 0 12px;
    padding-bottom: 8px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-auto-rows: minmax(min-content, max-content);
    grid-gap: 8px;

    grid-template-areas: 'participants chat';
`;

const Participants = styled.div`
    padding: 0 12px;
    background: white;
    grid-area: participants;
    display: flex;
    flex-flow: column nowrap;
`;

const Participant = styled.div``;

const Badge = styled.span`
    color: #777;
    font-size: 12px;
`;

const ChatArea = styled(Chat)`
    padding: 0 12px;
    padding-bottom: 8px;
`;

const StartGameButton = styled.button`
    position: absolute;
    right: 16px;
`;

const GameRoom: React.FC = () => {
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

    if (room.isGameStarted && !room.isGameEnded)
        return <Redirect to="/game" />;

    const handleStartGameClick = () => {
        dispatch(startGame());
    };

    return (
        <ViewWrapper>
            <Header>
                {room.name}
                {(room.owner === currentUser?.id && !room.isGameEnded) && (
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

export default GameRoom;
