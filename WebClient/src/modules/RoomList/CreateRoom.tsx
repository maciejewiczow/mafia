import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { CgEnter } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';
import { useAppDispatch } from 'store/hooks';
import { createRoom } from 'store/Rooms/actions';
import styled from 'styled-components';

const Wrapper = styled.div`
    margin: 8px 0;
`;

const MyForm = styled.form`
    display: inline-block;
`;

export const CreateRoom: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [roomName, setRoomName] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(createRoom(roomName));
    };

    return (
        <Wrapper>
            {isCollapsed ? (
                <Button variant="primary" onClick={() => setIsCollapsed(false)}>Stwórz grę &nbsp;<FaPlus /></Button>
            ) : (
                <MyForm action="" onSubmit={handleSubmit}>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Nazwa gry" value={roomName} onChange={e => setRoomName(e.target.value)} required />
                        <Button variant="primary" type="submit"><CgEnter /></Button>
                    </InputGroup>
                </MyForm>
            )}
        </Wrapper>
    );
};
