import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import dayjs from 'dayjs';
import { replace } from 'connected-react-router';
import { ChatTypeEnum, PhaseEnum, RoleEnum } from 'api';
import { connectToGame, invokeVote } from 'store/Game/actions';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
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
    Participant,
    Badge,
    ChatArea,
} from './parts';
import { ParticipantWithVoteButton } from './ParticipantWithVoteButton';

// TODO: Clear state after the game is finished

const GameView: React.FC = () => {
    const dispatch = useDispatch();
    const room = useSelector(roomSelectors.currentRoom);
    const isUserLoading = useSelector(userSelectors.isUserLoading);
    const currentUser = useSelector(userSelectors.currentUser);
    const currentUserRoles = useSelector(gameSelectors.userRoles(currentUser?.id || ''));
    const isConnectedToGame = useSelector(gameSelectors.isConnectedToGame);
    const isConnectingToGame = useSelector(gameSelectors.isConnectingToGame);
    const isCurrentRoomLoading = useSelector(roomSelectors.isCurrentRoomLoading);
    const participantsWithNamesAndRoles = useSelector(gameSelectors.participantsWithNamesAndRoles);
    const currentGameState = useSelector(gameSelectors.currentGameState);

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

    const remaining = useCountdown(currentGameState?.votingEnd || '');

    if (!isUserLoading && currentUser?.roomId === null)
        return <Redirect to="/" />;

    if (!room)
        return <div>Loading current room...</div>;

    if (!isCurrentRoomLoading && !room.hasGameStarted && !room.hasGameEnded)
        return <Redirect to="/room" />;

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
