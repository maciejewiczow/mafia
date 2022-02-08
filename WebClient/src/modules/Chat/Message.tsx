import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { MessageType } from 'store/GameChat/Chat/store';
import * as userSelectors from 'store/User/selectors';
import { MessageInStoreWithUserName } from 'store/GameChat/Chat/selectors';

const DefaultMessage = styled.div``;

const AnnouncementMessage = styled.div`
    text-align: center;
    font-size: 14px;
    color: #646464;
    margin: 4px 0;
`;

const DateTag = styled.span`
    color: #494949;
`;

export interface MessageProps {
    message: MessageInStoreWithUserName;
    clasName?: string;
}

const Message: React.FC<MessageProps> = ({ message, clasName }) => {
    const currentUser = useSelector(userSelectors.currentUser);

    if (message.messageType === MessageType.Announcement) {
        const { sentAt, content } = message;
        return (
            <AnnouncementMessage className={clasName} title={new Date(sentAt).toLocaleString()}>
                {content}
            </AnnouncementMessage>
        );
    }

    const { sentAt, userId, userName, content } = message;
    return (
        <DefaultMessage className={clasName} title={new Date(sentAt).toLocaleString()}>
            <DateTag>[{new Date(sentAt).toLocaleTimeString()}] </DateTag>
            {
                (userId === currentUser?.id) ? (<b>{currentUser.name}</b>) : (userName || userId)
            }: {content}
        </DefaultMessage>
    );
};

export default Message;
