import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getRooms } from '../../store/Rooms/actions';
import * as selectors from '../../store/Rooms/selectors';
import { currentUser as currentUserSelector } from '../../store/User/selectors';
import CreateRoom from './CreateRoom';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 8px 24px;
`;

const Error = styled.div`
    color: tomato;
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
`;

const Item = styled.div`
    width: 100%;
    padding: 6px 2px;
    display: flex;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    {rooms.map(({ id, name, currentPlayersCount, maxPlayers }) => (
                        <Item key={id}>
                            {name}, {currentPlayersCount}/{maxPlayers} graczy
                        </Item>
                    ))}
                </List>
            )}
        </Wrapper>
    );
};

export default RoomList;
