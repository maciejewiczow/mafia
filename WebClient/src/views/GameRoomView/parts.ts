import { Chat } from 'modules';
import styled from 'styled-components';

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
    grid-auto-rows: minmax(min-content, max-content);
    grid-gap: 8px;

    grid-template-areas: 'participants chat';
`;

export const Participants = styled.div`
    padding: 0 12px 12px;
    background: white;
    grid-area: participants;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
`;

export const Participant = styled.div``;

export const Badge = styled.span`
    color: #777;
    font-size: 12px;
`;

export const ChatArea = styled(Chat)`
    padding: 0 12px;
    padding-bottom: 8px;
    /* TODO: zrobić jakoś żeby to było na 100% a nie z jakimś hardcoded height */
    max-height: calc(100vh - 90px);
`;

export const StartGameButton = styled.button`
    position: absolute;
    right: 16px;
`;
