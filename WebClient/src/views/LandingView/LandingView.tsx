import React from 'react';
import { ViewWrapper } from '../ViewWrapper';
import { RoomListArea, UserArea, Header, ContentWrapper } from './parts';

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
