import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import dayjs from 'dayjs';
import { ChatTypeEnum, PhaseEnum, RoleEnum } from 'api';
import { connectToGameChat } from 'store/GameChat/actions';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/GameChat/Game/selectors';
import * as gameChatSelectors from 'store/GameChat/selectors';
import { IoIosCloudyNight, IoIosSunny } from 'react-icons/io';
import { useCountdown } from 'utils/hooks/useCountdown';
import { getCurrentUser } from 'store/User/actions';
import { ViewWrapper } from '../ViewWrapper';
import {
    PhaseCounter,
    Phase,
    ChatsWrapper,
    WinnerOverlay,
    GoBack,
    Header,
    ContentWrapper,
    Participants,
    ChatArea,
} from './parts';
import { ParticipantWithVoteButton } from './ParticipantWithVoteButton';
import { useAppDispatch } from 'store/hooks';
import { replace } from 'redux-first-history';

// TODO: Clear state after the game is finished

const GameView: React.FC = () => {
    const dispatch = useAppDispatch();
    const room = useSelector(roomSelectors.currentRoom);
    const isUserLoading = useSelector(userSelectors.isUserLoading);
    const currentUser = useSelector(userSelectors.currentUser);
    const currentUserRoles = useSelector(gameSelectors.userRoles(currentUser?.id || ''));
    const isConnectedToGameChat = useSelector(gameChatSelectors.isConnectedToGameChat);
    const isConnectingToGameChat = useSelector(gameChatSelectors.isConnectingToGameChat);
    const isCurrentRoomLoading = useSelector(roomSelectors.isCurrentRoomLoading);
    const participantsWithNamesAndRoles = useSelector(gameSelectors.participantsWithNamesAndRoles);
    const currentGameState = useSelector(gameSelectors.currentGameState);

    useEffect(() => {
        if (!isUserLoading && currentUser?.roomId !== null && !isConnectingToGameChat && !isConnectedToGameChat)
            dispatch(connectToGameChat());
    }, [
        currentUser?.roomId,
        dispatch,
        isConnectedToGameChat,
        isConnectingToGameChat,
        isUserLoading,
        room,
    ]);

    const remaining = useCountdown(currentGameState?.votingEnd || '');

    if (!isUserLoading && currentUser?.roomId === null)
        return <Navigate to="/" />;

    if (!room)
        return <div>Loading current room...</div>;

    if (!isCurrentRoomLoading && !room.hasGameStarted && !room.hasGameEnded)
        return <Navigate to="/room" />;

    if (!currentGameState)
        return <div>To się nie powinno zdazyc</div>;

    const { phase } = currentGameState;

    const handleGoBackClick = () => {
        // FIXME: ogarnąć update stanu po końcu gry lepiej
        dispatch(getCurrentUser());
        dispatch(replace('/'));
    };

    return (
        <ViewWrapper>
            <Header>
                {currentGameState.votingEnd && <PhaseCounter title="Czas do końca głosowania">{dayjs(remaining).format('mm:ss')}</PhaseCounter>}
                {room.name}
                <Phase>{phase} {(phase === PhaseEnum.Day) ? <IoIosSunny /> : <IoIosCloudyNight />}</Phase>
            </Header>
            <ContentWrapper>
                <Participants>
                    <h3>Uczestnicy gry</h3>
                    {participantsWithNamesAndRoles?.map(user => <ParticipantWithVoteButton key={user.id} phase={phase} participant={user} />)}
                </Participants>
                <ChatsWrapper>
                    {(currentUserRoles.includes(RoleEnum.Citizen) || currentUserRoles.includes(RoleEnum.Mafioso)) && <ChatArea chatType={ChatTypeEnum.Citizen} />}
                    {currentUserRoles.includes(RoleEnum.Mafioso) && <ChatArea chatType={ChatTypeEnum.Mafia} />}
                    {currentUserRoles.includes(RoleEnum.Ghost) && <ChatArea chatType={ChatTypeEnum.Ghost} />}
                </ChatsWrapper>
            </ContentWrapper>
            {(room.hasGameEnded) && (
                <WinnerOverlay>
                    Koniec gry!
                    {room.winnerRole && <span>Wygrany: {room.winnerRole}</span>}
                    <GoBack type="button" onClick={handleGoBackClick}>Powrót do ekranu głównego</GoBack>
                </WinnerOverlay>
            )}
        </ViewWrapper>
    );
};

export default GameView;
