import React, { useEffect } from 'react';
import { useResource } from 'react-request-hook';
import styled from 'styled-components';
import { RoomsResponse } from '../../api';

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
    const [{ data, error, isLoading }, getRooms] = useResource(() => ({ url: '/GameRooms' }));

    const rooms = data as RoomsResponse | undefined;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(getRooms, []);

    return (
        <Wrapper className={className}>
            <Header>Pokoje</Header>
            {(isLoading || !rooms) && <div>Ładowanie pokoi...</div>}
            {error && <Error>Błąd ładowania</Error>}
            {(rooms && !rooms.length) && <Empty>Brak</Empty>}
            {rooms && (
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
