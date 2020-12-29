import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getRooms, joinRoom } from 'store/Rooms/actions';
import * as selectors from 'store/Rooms/selectors';
import { currentUser as currentUserSelector } from 'store/User/selectors';
import CreateRoom from './CreateRoom';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 8px 24px;
`;

const Empty = styled.div`
    color: #666;
`;

const Header = styled.h2`
    margin-top: 0;
`;

const List = styled.div`
    text-align: left;
    display: flex;
    flex-flow: column nowrap;
    max-width: 600px;
    margin: 0 auto;
`;

const Item = styled.div`
    width: 100%;
    padding: 6px 2px;
    display: flex;
    justify-content: space-between;
`;

interface ClassProps {
    className?: string;
}

const RoomList: React.FC<ClassProps> = ({ className }) => {
    const dispatch = useDispatch();

    const areRoomsLoading = useSelector(selectors.areRoomsLoading);
    const isUserLoggedIn = !!useSelector(currentUserSelector);
    const rooms = useSelector(selectors.rooms);

    useEffect(() => {
        dispatch(getRooms());
    }, [dispatch]);

    const handleJoinClick = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(joinRoom(id));
    };

    if (areRoomsLoading)
        return <Wrapper className={className}>Ładowanie pokoi...</Wrapper>;

    return (
        <Wrapper className={className}>
            <Header>Pokoje</Header>
            {isUserLoggedIn && <CreateRoom />}
            {!rooms.length ? (
                <Empty>Brak aktywnych pokoi</Empty>
            ) : (
                <List>
                    {rooms.map(({ id, name, currentPlayersCount, maxPlayers, isGameStarted }) => (
                        <Item key={id}>
                            <span>{name} </span>
                            <span>{currentPlayersCount}/{maxPlayers} graczy</span>
                            {isUserLoggedIn && (
                                <>
                                    {(currentPlayersCount < maxPlayers && !isGameStarted) && <a href="" onClick={handleJoinClick(id)}>Dołącz</a>}
                                    {(currentPlayersCount >= maxPlayers) && <span>Pokój jest pełny</span>}
                                    {isGameStarted && <span>Gra już się rozpoczęła</span>}
                                </>
                            )}
                        </Item>
                    ))}
                </List>
            )}
        </Wrapper>
    );
};

export default RoomList;
