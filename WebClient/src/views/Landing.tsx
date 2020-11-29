import React from 'react';
import styled from 'styled-components';
import CreateUser from 'modules/CreateUser/CreateUser';
import RoomList from 'modules/RoomList/RoomList';
import { ViewWrapper } from './ViewWrapper';

const Header = styled.header`
    background-color: #282c34;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(15px + 2vmin);
    color: white;
    padding: 16px;

    grid-area: header;
`;

const ContentWrapper = styled.div`
    padding: 0 12px;

    grid-area: body;

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
    <ViewWrapper>
        <Header>Mafia</Header>
        <ContentWrapper>
            <RoomListArea />
            <UserArea />
        </ContentWrapper>
    </ViewWrapper>
);

export default LandingView;
