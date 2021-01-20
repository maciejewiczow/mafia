import React, { useState } from 'react';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createRoom } from 'store/Rooms/actions';

const Wrapper = styled.div`
    padding: 12px;
    margin-top: 8px;
`;

const Title = styled.h4`
    margin-top: 0;
    margin-bottom: 8px;
`;

const CreateRoom: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [roomName, setRoomName] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(createRoom(roomName));
    };

    return (
        <Wrapper>
            {isCollapsed ? (
                <button type="button" onClick={() => setIsCollapsed(false)}><FaPlus /> dodaj pokój</button>
            ) : (
                <>
                    <Title>Stwórz pokój</Title>
                    <form action="" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Nazwa pokoju" value={roomName} onChange={e => setRoomName(e.target.value)} required />
                        <button type="submit">Stwórz <FaArrowRight /></button>
                    </form>
                </>
            )}
        </Wrapper>
    );
};

export default CreateRoom;
