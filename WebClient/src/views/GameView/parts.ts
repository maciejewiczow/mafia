import { Chat } from 'modules';
import styled, { css } from 'styled-components';

export const Header = styled.header`
    background-color: #282c34;
    display: flex;
    font-size: calc(15px + 2vmin);
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 16px;

    position: relative;

    grid-area: header;
`;

export const ContentWrapper = styled.div`
    grid-area: body;

    padding: 0 12px;
    padding-bottom: 8px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr;
    grid-gap: 8px;

    grid-template-areas: 'participants chat';
`;

export const Participants = styled.div`
    padding: 0 12px;
    background: white;
    grid-area: participants;
    display: flex;
    flex-flow: column nowrap;
`;

export const Participant = styled.div``;

export const ParticipantName = styled.span<{isHighlighted?: boolean}>`
    ${({ isHighlighted }) => isHighlighted && css`
        color: #b50808;
        font-weight: bold;
    `}
`;

export const Badge = styled.span`
    color: #777;
    font-size: 12px;
`;

export const ChatsWrapper = styled.div`
    display: flex;
    grid-area: chat;
    background: transparent;
`;

export const ChatArea = styled(Chat)`
    padding: 0 12px;
    padding-bottom: 8px;
    margin-right: 8px;
    flex: 1;
    &:last-child {
        margin-right: 0;
    }
`;

export const Phase = styled.div`
    position: absolute;
    right: 16px;
`;

export const WinnerOverlay = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(21.8%, 21.8%, 21.8%, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    flex-flow: column nowrap;
    backdrop-filter: blur(2px);
`;

export const GoBack = styled.button`
    font-size: 17px;
    margin-top: 24px;
`;

export const PhaseCounter = styled.div`
    position: absolute;
    left: 16px;
`;
