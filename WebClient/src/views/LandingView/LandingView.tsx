import React from 'react';
import { FaUserSecret } from 'react-icons/fa';
import { ViewWrapper } from '../ViewWrapper';
import { RoomListArea, UserArea, Header, ContentWrapper } from './parts';

const LandingView = () => (
    <ViewWrapper>
        <Header>Mafia&nbsp;<FaUserSecret /></Header>
        <ContentWrapper>
            <RoomListArea />
            <UserArea />
        </ContentWrapper>
    </ViewWrapper>
);

export default LandingView;
