import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import * as roomSelectors from '../store/Rooms/selectors';

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

    grid-template-areas: 'participants chat';
`;

const Participants = styled.div`
    background: white;
    grid-area: participants;
    display: flex;
    flex-flow: column nowrap;
`;

const Participant = styled.div``;

const Chat = styled.div`
    grid-area: chat;
    background: white;
`;

const AdminBadge = styled.span`
    color: #777;
    font-size: 12px;
`;

const MessagesWrapper = styled.div`
    overflow-y: auto;
`;

const MessageInput = styled.input`
    width: 100%;
`;

const GameRoom: React.FC = () => {
    const room = useSelector(roomSelectors.currentRoom);

    return (
        <>
            <Header>{room?.name}</Header>
            <ContentWrapper>
                <Participants>
                    <h3>Uczestnicy gry</h3>
                    {room?.participantsWithNames.map(user => (
                        <Participant key={user.id}>
                            {user.name} {(user.id === room.owner) && <AdminBadge>(admin)</AdminBadge>}
                        </Participant>)
                    )}
                </Participants>
                <Chat>
                    <h3>Chat</h3>
                    <MessagesWrapper>
                        ugabuga
                    </MessagesWrapper>
                    <MessageInput type="text" placeholder="Napisz coś..."/>
                </Chat>
            </ContentWrapper>
        </>
    );
};

export default GameRoom;
