import React from 'react';
import { FaUserSecret } from 'react-icons/fa';
import { ViewWrapper } from '../ViewWrapper';
import { ContentWrapper, Header, RoomListArea, UserArea } from './parts';

export const LandingView = () => (
    <ViewWrapper>
        <Header>
            Mafia&nbsp;
            <FaUserSecret />
        </Header>
        <ContentWrapper>
            <RoomListArea />
            <UserArea />
        </ContentWrapper>
    </ViewWrapper>
);
