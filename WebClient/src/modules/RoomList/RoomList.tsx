import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getRooms } from '../../store/Rooms/actions';
import * as selectors from '../../store/Rooms/selectors';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 5px;
`;

const Error = styled.div`
    color: tomato;
`;

const Empty = styled.div`
    color: #666;
`;

const Header = styled.h2``;

const List = styled.ul`
    text-align: left;
`;

interface ClassProps {
    className?: string;
}

const RoomList: React.FC<ClassProps> = ({ className }) => {
    const dispatch = useDispatch();

    const isLoading = useSelector(selectors.areRoomsLoading);
    const rooms = useSelector(selectors.rooms);

    useEffect(() => {
        dispatch(getRooms());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading)
        return <div>Ładowanie pokoi...</div>;

    return (
        <Wrapper className={className}>
            <Header>Pokoje</Header>
            {!rooms.length ? (
                <Empty>Brak aktywnych pokoi</Empty>
            )
                : (
                    <List>
                        {rooms.map(({ id, name, currentPlayersCount, maxPlayers }) => (
                            <li key={id}>{name}, {currentPlayersCount}/{maxPlayers} graczy</li>
                        ))}
                    </List>
                )}
        </Wrapper>
    );
};

export default RoomList;
