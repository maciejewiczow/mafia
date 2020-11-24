import React from 'react';
import styled from 'styled-components';
import CreateUser from '../modules/CreateUser/CreateUser';
import RoomList from '../modules/RoomList/RoomList';

const Wrapper = styled.div`
    text-align: center;
    background: #efefef;
    min-height: 100vh;
`;

const Header = styled.header`
    background-color: #282c34;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(15px + 2vmin);
    color: white;
    padding: 16px;
    margin-bottom: 8px;
`;

const ContentWrapper = styled.div`
    padding: 0 12px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 8px;

    grid-template-areas: 'user rooms';
`;

const RoomListArea = styled(RoomList)`
    grid-area: rooms;
`;

const UserArea = styled(CreateUser)`
    grid-area: user;
    height: 250px;
`;

const LandingView = () => (
    <Wrapper>
        <Header>Mafia</Header>
        <ContentWrapper>
            <RoomListArea />
            <UserArea />
        </ContentWrapper>
    </Wrapper>
);

export default LandingView;
