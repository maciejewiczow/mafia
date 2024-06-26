import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store/hooks';
import { createUser } from 'store/User/actions';
import * as selectors from 'store/User/selectors';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
`;

interface ClassProps {
    className?: string;
}

export const CreateUser: React.FC<ClassProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const [userName, setUserName] = useState('');

    const isLoading = useSelector(selectors.isUserLoading);
    const currentUser = useSelector(selectors.currentUser);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(createUser(userName));
    };

    return (
        <Wrapper className={className}>
            {isLoading ? (
                <div>Ładowanie...</div>
            ) : currentUser ? (
                <>
                    <div>Twój nick to </div>
                    <h2>{currentUser?.name}</h2>
                </>
            ) : (
                <>
                    <h3>Wybierz nick</h3>
                    <Form
                        action=""
                        onSubmit={handleSubmit}
                    >
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Twój nick"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                required
                            />
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Ok
                            </Button>
                        </InputGroup>
                    </Form>
                </>
            )}
        </Wrapper>
    );
};
