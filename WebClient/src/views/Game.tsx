import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { Chat } from 'modules';
import { ChatTypeEnum, RoleEnum } from 'api';
import { connectToGame } from 'store/Game/actions';
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

const ChatsWrapper = styled.div`
    display: flex;
    grid-area: chat;
    background: transparent;
`;

const ChatArea = styled(Chat)`
    padding: 0 12px;
    padding-bottom: 8px;
    margin-right: 8px;
    flex: 1;
`;

const Game: React.FC = () => {
    const dispatch = useDispatch();
    const room = useSelector(roomSelectors.currentRoom);
    const isUserLoading = useSelector(userSelectors.isUserLoading);
    const currentUser = useSelector(userSelectors.currentUser);
    const currentUserRoles = useSelector(gameSelectors.userRoles(currentUser?.id || ''));
    const isConnectedToGame = useSelector(gameSelectors.isConnectedToGame);
    const isConnectingToGame = useSelector(gameSelectors.isConnectingToGame);

    useEffect(() => {
        if (!isUserLoading && currentUser?.roomId !== null && !isConnectingToGame && !isConnectedToGame)
            dispatch(connectToGame());
    }, [
        currentUser?.roomId,
        dispatch,
        isConnectedToGame,
        isConnectingToGame,
        isUserLoading,
        room,
    ]);

    if (!isUserLoading && currentUser?.roomId === null)
        return <Redirect to="/" />;

    if (!room)
        return <div>Loading current room...</div>;

    if (!room.isGameStarted) {
        // FIXME: fix redirect jumping between room and game
        return <Redirect to="/room" />;
    }

    return (
        <ViewWrapper>
            <Header>
                {room.name}
            </Header>
            <ContentWrapper>
                <Participants>
                    <h3>Uczestnicy gry</h3>
                    {room.participantsWithNames.map(user => (
                        // FaUserSecret
                        // FaGhost
                        <Participant key={user.id}>
                            {user.name}
                            {' '}
                            {(user.id === currentUser?.id) && <Badge>(ty)</Badge> }
                        </Participant>
                    ))}
                </Participants>
                <ChatsWrapper>
                    {(currentUserRoles.includes(RoleEnum.Citizen) || currentUserRoles.includes(RoleEnum.Mafioso)) && <ChatArea chatType={ChatTypeEnum.Citizen} />}
                    {currentUserRoles.includes(RoleEnum.Mafioso) && <ChatArea chatType={ChatTypeEnum.Mafia} />}
                    {currentUserRoles.includes(RoleEnum.Ghost) && <ChatArea chatType={ChatTypeEnum.Ghost} />}
                </ChatsWrapper>
            </ContentWrapper>
        </ViewWrapper>
    );
};

export default Game;
