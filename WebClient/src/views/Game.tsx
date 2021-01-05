import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import dayjs from 'dayjs';
import { Chat } from 'modules';
import { ChatTypeEnum, PhaseEnum, RoleEnum } from 'api';
import { connectToGame, invokeVote } from 'store/Game/actions';
import * as roomSelectors from 'store/Rooms/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
import { FaGhost, FaUserSecret } from 'react-icons/fa';
import { IoIosCloudyNight, IoIosSunny } from 'react-icons/io';
import { useCountdown } from 'utils/hooks/useCountdown';
import { getCurrentUser } from 'store/User/actions';
import { replace } from 'connected-react-router';
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
    grid-template-rows: 1fr;
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
    &:last-child {
        margin-right: 0;
    }
`;

const Phase = styled.div`
    position: absolute;
    right: 16px;
`;

const WinnerOverlay = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(21.8%, 21.8%, 21.8%, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    flex-flow: column nowrap;
    backdrop-filter: blur(2px);
`;

const GoBack = styled.button`
    font-size: 17px;
    margin-top: 24px;
`;

const PhaseCounter = styled.div`
    position: absolute;
    left: 16px;
`;

// TODO: Clear state after the game is finished

const Game: React.FC = () => {
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

    const voteForUser = (userId: string) => () => {
        dispatch(invokeVote(userId));
    };

    const handleGoBackClick = () => {
        // FIXME: ogarnąć update stanu po końcu gry lepiej
        dispatch(getCurrentUser());
        dispatch(replace('/'));
    };

    return (
        <ViewWrapper>
            <Header>
                {currentGameState.votingEnd && <PhaseCounter title="Czas do końca głsowoania">{dayjs(remaining).format('mm:ss')}</PhaseCounter>}
                {room.name}
                <Phase>{phase} {(phase === PhaseEnum.Day) ? <IoIosSunny /> : <IoIosCloudyNight />}</Phase>
            </Header>
            <ContentWrapper>
                <Participants>
                    <h3>Uczestnicy gry</h3>
                    {participantsWithNamesAndRoles?.map(user => {
                        let shouldShowVoteButton = false;

                        // TODO: dodać do api metodę w stylu isVoteValid
                        if (phase === PhaseEnum.Night)
                            shouldShowVoteButton = currentUserRoles.includes(RoleEnum.Mafioso) && !user.roles.includes(RoleEnum.Mafioso);
                        else if (phase === PhaseEnum.Day)
                            shouldShowVoteButton = true;

                        shouldShowVoteButton = shouldShowVoteButton && !currentUserRoles.includes(RoleEnum.Ghost) && !user.roles.includes(RoleEnum.Ghost);

                        if (currentUser?.id === user.id)
                            shouldShowVoteButton = false;

                        return (
                            <Participant key={user.id}>
                                {user.name}
                                {' '}
                                {user.roles.includes(RoleEnum.Mafioso) && currentUserRoles.includes(RoleEnum.Mafioso) && <span><FaUserSecret title="Mafia" /> </span>}
                                {user.roles.includes(RoleEnum.Ghost) && <FaGhost title="Duch" />}

                                {(user.id === currentUser?.id) && <Badge> (ty)</Badge> }
                                {shouldShowVoteButton && <button type="button" onClick={voteForUser(user.id)}>Zagłosuj</button>}
                            </Participant>
                        );
                    })}
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

export default Game;
