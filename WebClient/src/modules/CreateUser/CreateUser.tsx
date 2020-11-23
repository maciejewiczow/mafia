import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import api, { CreateUserResponse, RoomsResponse } from '../../api';
import { setTokens } from '../../api/tokens';
import { getCurrentUser } from '../../store/User/actions';
import * as selectors from '../../store/User/selectors';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 5px;
`;

const NickInput = styled.input`
    padding: 3px 5px;
`;

const Button = styled.button`
    padding: 3px 5px;
`;

interface ClassProps {
    className?: string;
}

const CreateUser: React.FC<ClassProps> = ({ className }) => {
    const dispatch = useDispatch();
    const [userName, setUserName] = useState('');

    const isLoading = useSelector(selectors.isUserLoading);
    const currentUser = useSelector(selectors.currentUser);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const token = await api.post<CreateUserResponse>('/Authentication/createUser', { userName });
            setTokens(token.data);

            dispatch(getCurrentUser());
        } catch (e) {
            console.error('User creation failed', e);
        }
    };

    return (
        <Wrapper className={className}>
            {isLoading ? (
                <div>Ładowanie...</div>
            ) : (
                currentUser ? (
                    <>
                        <div>Twój nick to </div>
                        <h2>{currentUser?.name}</h2>
                    </>
                ) : (
                    <>
                        <h2>Podaj nickname</h2>
                        <form action="" onSubmit={handleSubmit}>
                            <NickInput type="text" placeholder="Twój nick" value={userName} onChange={e => setUserName(e.target.value)} required />
                            <Button type="submit">Ok</Button>
                        </form>
                    </>
                ))}
        </Wrapper>
    );
};

export default CreateUser;
