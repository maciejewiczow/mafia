import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ChatTypeEnum } from '../../api';
import { connectToChat, sendMessage } from '../../store/Chat/actions';
import * as chatSelectors from '../../store/Chat/selectors';
import * as userSelectors from '../../store/User/selectors';

export interface ChatProps {
    className?: string;
    chatType: ChatTypeEnum;
}

const ChatWrapper = styled.div`
    grid-area: chat;
    background: white;
    display: flex;
    flex-flow: column nowrap;
    max-height: 85vh;
`;

const MessagesWrapper = styled.div`
    overflow: auto;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
`;

const ChatHeader = styled.h3``;

const MessageInput = styled.input`
    width: 100%;
`;

const MessageForm = styled.form`
    margin-top: 12px;
    display: flex;
`;

const DateTag = styled.span`
    color: #494949;
`;

const Chat: React.FC<ChatProps> = ({ chatType, className }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector(userSelectors.currentUser);
    const messages = useSelector(chatSelectors.chatMessages(chatType));
    const isConnected = useSelector(chatSelectors.isConnectedToChat);
    const isConnecting = useSelector(chatSelectors.isConnectingToChat);

    const [currentMessageContent, setCurrentMessageContent] = useState('');

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isConnected && !isConnecting)
            dispatch(connectToChat());
    }, [dispatch, isConnected, isConnecting]);

    useLayoutEffect(() => {
        if (!scrollAreaRef.current)
            return;

        const el = scrollAreaRef.current;

        // scroll is at the bottom
        if (Math.abs((el.scrollHeight - el.scrollTop) - el.clientHeight) < 30)
            el.scrollTop = el.scrollHeight;

    }, [messages]);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(sendMessage(chatType, currentMessageContent));
        setCurrentMessageContent('');
    };

    return (
        <ChatWrapper className={className}>
            <ChatHeader>{chatType} chat</ChatHeader>
            {isConnecting ? (
                <div>Connecting to chat...</div>
            ) : (
                <>
                    <MessagesWrapper ref={scrollAreaRef}>
                        {!messages?.length ? (
                            <div>There are no messages in this chat</div>
                        ) : (
                            messages.map(({ id, userName, userId, content, sentAt }) => (
                                <div key={id} title={new Date(sentAt).toLocaleString()}>
                                    <DateTag>[{new Date(sentAt).toLocaleTimeString()}] </DateTag>
                                    {
                                        (userId === currentUser?.id) ?(
                                            <b>{currentUser.name}</b>
                                        ) : (
                                            userName || userId
                                        )
                                    }: {content}
                                </div>
                            ))
                        )}
                    </MessagesWrapper>
                    <MessageForm onSubmit={handleSendMessage}>
                        <MessageInput
                            type="text"
                            placeholder="Napisz coś..."
                            value={currentMessageContent}
                            onChange={e => setCurrentMessageContent(e.target.value)}
                            required
                        />
                        <button type="submit"><AiOutlineSend /></button>
                    </MessageForm>
                </>
            )}
        </ChatWrapper>
    );
};

export default Chat;
