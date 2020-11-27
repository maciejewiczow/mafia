import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AiOutlineSend } from 'react-icons/ai';
import { ChatTypeEnum } from '../api';
import { connectToChat, sendMessage } from '../store/Chat/actions';
import * as chatSelectors from '../store/Chat/selectors';
import * as roomSelectors from '../store/Rooms/selectors';
import { Redirect } from 'react-router';
import { currentUser as currentUserSelector } from '../store/User/selectors';

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

const Badge = styled.span`
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
    const dispatch = useDispatch();
    const [messageContent, setMessageContent] = useState('');

    const room = useSelector(roomSelectors.currentRoom);
    const currentUser = useSelector(currentUserSelector);
    const messages = useSelector(chatSelectors.chatMessages(ChatTypeEnum.General));
    const isConnected = useSelector(chatSelectors.isConnectedToChat);
    const isConnecting = useSelector(chatSelectors.isConnectingToChat);

    useEffect(() => {
        if (!isConnected && !isConnecting)
            dispatch(connectToChat());
    }, [dispatch, isConnected, isConnecting]);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(sendMessage(ChatTypeEnum.General, messageContent));
        setMessageContent('');
    };

    if (!room)
        return <Redirect to="/"/>;

    return (
        <>
            <Header>{room.name}</Header>
            <ContentWrapper>
                <Participants>
                    <h3>Uczestnicy gry</h3>
                    {room.participantsWithNames.map(user => (
                        <Participant key={user.id}>
                            {user.name} {(user.id === currentUser?.id) && <Badge>(Ty)</Badge> } {(user.id === room.owner) && <Badge>(admin)</Badge>}
                        </Participant>)
                    )}
                </Participants>
                <Chat>
                    <h3>Chat</h3>
                    {isConnecting ? (
                        <div>Connecting to chat...</div>
                    ) : (
                        <>
                            <MessagesWrapper>
                                {!messages?.length ? (
                                    <div>There are no messages in this chat</div>
                                ) : (
                                    messages.map(({ userId, content }) => (
                                        <div>{userId}: {content}</div>
                                    ))
                                )}
                            </MessagesWrapper>
                            <form onSubmit={handleSendMessage}>
                                <MessageInput
                                    type="text"
                                    placeholder="Napisz coś..."
                                    value={messageContent}
                                    onChange={e => setMessageContent(e.target.value)}
                                    required
                                />
                                <button type="submit"><AiOutlineSend/></button>
                            </form>
                        </>
                    )}
                </Chat>
            </ContentWrapper>
        </>
    );
};

export default GameRoom;
