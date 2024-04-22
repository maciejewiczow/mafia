import React, { useLayoutEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { AiOutlineSend } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { ChatTypeEnum } from 'api';
import { sendMessage } from 'store/GameChat/Chat/actions';
import * as chatSelectors from 'store/GameChat/Chat/selectors';
import * as gameChatSelectors from 'store/GameChat/selectors';
import { useAppDispatch } from 'store/hooks';
import styled from 'styled-components';
import Message from './Message';

export interface ChatProps {
    className?: string;
    chatType: ChatTypeEnum;
}

const ChatWrapper = styled.div`
    grid-area: chat;
    background: white;
    display: flex;
    flex-flow: column nowrap;
`;

const MessagesWrapper = styled.div`
    overflow: auto;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
`;

const ChatHeader = styled.h3``;

const MessageFormWrapper = styled.div`
    margin-top: 12px;
`;

const NoMessages = styled.div`
    color: #888;
`;

export const Chat: React.FC<ChatProps> = ({ chatType, className }) => {
    const dispatch = useAppDispatch();

    const messages = useSelector(chatSelectors.chatMessages(chatType));
    const isConnected = useSelector(gameChatSelectors.isConnectedToGameChat);
    const isConnecting = useSelector(gameChatSelectors.isConnectingToGameChat);

    const [currentMessageContent, setCurrentMessageContent] = useState('');

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!scrollAreaRef.current) {
            return;
        }

        const el = scrollAreaRef.current;

        // scroll is at the bottom
        if (Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 30) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(sendMessage(chatType, currentMessageContent));
        setCurrentMessageContent('');
    };

    return (
        <ChatWrapper className={className}>
            <ChatHeader>{chatType} chat</ChatHeader>
            {!isConnected ? (
                (isConnecting && <div>Connecting to chat...</div>) || (
                    <div>Not connected to chat</div>
                )
            ) : (
                <>
                    <MessagesWrapper ref={scrollAreaRef}>
                        {!messages?.length ? (
                            <NoMessages>
                                Nikt jeszcze nic nie napisał w tym chacie
                            </NoMessages>
                        ) : (
                            messages.map(m => (
                                <Message
                                    message={m}
                                    key={m.id}
                                />
                            ))
                        )}
                    </MessagesWrapper>
                    <MessageFormWrapper>
                        <Form onSubmit={handleSendMessage}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Napisz coś..."
                                    value={currentMessageContent}
                                    onChange={e => setCurrentMessageContent(e.target.value)
                                    }
                                    required
                                />
                                <Button
                                    variant="secondary"
                                    type="submit"
                                >
                                    <AiOutlineSend />
                                </Button>
                            </InputGroup>
                        </Form>
                    </MessageFormWrapper>
                </>
            )}
        </ChatWrapper>
    );
};
