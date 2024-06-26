import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store/hooks';
import { getRooms, joinRoom } from 'store/Rooms/actions';
import * as selectors from 'store/Rooms/selectors';
import { currentUser as currentUserSelector } from 'store/User/selectors';
import styled from 'styled-components';
import { CreateRoom } from './CreateRoom';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 24px 32px;
`;

const Empty = styled.div`
    color: #666;
`;

const Header = styled.h3`
    margin: 12px 0 24px 0;
`;

const List = styled.div`
    text-align: left;

    display: grid;
    grid-template-columns: 1fr 1fr auto;

    margin: 0 0 24px 0;

    & > * {
        padding: 12px 0;
        border-bottom: 1px solid #eee;
    }
`;

const HeaderItem = styled.div`
    font-weight: bold;
    font-size: 90%;
`;

interface ClassProps {
    className?: string;
}

export const RoomList: React.FC<ClassProps> = ({ className }) => {
    const dispatch = useAppDispatch();

    const areRoomsLoading = useSelector(selectors.areRoomsLoading);
    const isUserLoggedIn = !!useSelector(currentUserSelector);
    const rooms = useSelector(selectors.rooms);

    useEffect(() => {
        dispatch(getRooms());
    }, [dispatch]);

    const handleJoinClick = (id: string) => (e: React.MouseEvent) => {
        dispatch(joinRoom(id));
    };

    if (areRoomsLoading) {
        return <Wrapper className={className}>Ładowanie pokoi...</Wrapper>;
    }

    return (
        <Wrapper className={className}>
            <Header>Trwające gry</Header>
            {isUserLoggedIn && <CreateRoom />}
            {!rooms.length ? (
                <Empty>Brak aktywnych gier</Empty>
            ) : (
                <List>
                    <HeaderItem>Nazwa gry</HeaderItem>
                    <HeaderItem>Uczestnicy</HeaderItem>
                    <HeaderItem />
                    {rooms.map(
                        ({
                            id,
                            name,
                            currentPlayersCount,
                            maxPlayers,
                            hasGameStarted,
                        }) => (
                            <React.Fragment key={id}>
                                <div>{name} </div>
                                <div>
                                    {currentPlayersCount}/{maxPlayers}
                                </div>
                                <div>
                                    {isUserLoggedIn && (
                                        <>
                                            {currentPlayersCount < maxPlayers &&
                                                !hasGameStarted && (
                                                    <Button
                                                        variant="outline-success"
                                                        onClick={handleJoinClick(
                                                            id,
                                                        )}
                                                    >
                                                        Dołącz
                                                    </Button>
                                                )}
                                            {currentPlayersCount >=
                                                maxPlayers && (
                                                <span>Pokój jest pełny</span>
                                            )}
                                            {hasGameStarted && (
                                                <span>
                                                    Gra już się rozpoczęła
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </React.Fragment>
                        ),
                    )}
                </List>
            )}
        </Wrapper>
    );
};
