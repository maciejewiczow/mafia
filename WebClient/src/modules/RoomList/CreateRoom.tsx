import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { FaPlus } from 'react-icons/fa';
import { CgEnter } from 'react-icons/cg';
import styled from 'styled-components';
import { createRoom } from 'store/Rooms/actions';
import { useAppDispatch } from 'store/hooks';

const Wrapper = styled.div`
    margin: 8px 0;
`;

const MyForm = styled.form`
    display: inline-block;
`;

const CreateRoom: React.FC = () => {
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

export default CreateRoom;
