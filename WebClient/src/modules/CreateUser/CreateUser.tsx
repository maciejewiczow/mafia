import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createUser } from '../../store/User/actions';
import * as selectors from '../../store/User/selectors';

const Wrapper = styled.div`
    width: 100%;
    background: white;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(createUser(userName));
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
