import { FiSettings } from 'react-icons/fi';
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

export const ContentWrapper = styled.div<{ areSettingsOpen?: boolean }>`
    grid-area: body;

    padding: 0 12px;
    padding-bottom: 8px;
    display: grid;
    grid-template-columns: 1fr 2fr 22%;
    grid-auto-rows: /* minmax(min-content, max-content) */ 1fr;
    grid-gap: 8px;

    ${({ areSettingsOpen }) => (areSettingsOpen
            ? css`
                  grid-template-areas: 'participants chat settings';
              `
            : css`
                  grid-template-areas: 'participants chat chat';
              `)}
`;

export const ParticipantsWrapper = styled.div`
    padding: 8px 12px;
    background: white;
    grid-area: participants;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
`;

export const SettingsWrapper = styled(ParticipantsWrapper)`
    grid-area: settings;

    form > div {
        margin-bottom: 18px;
    }
`;

export const Participant = styled.div``;

export const Badge = styled.span`
    color: #777;
    font-size: 12px;
`;

export const ChatArea = styled(Chat)`
    padding: 8px 12px;
    padding-bottom: 8px;
    /* TODO: zrobić jakoś żeby to było na 100% a nie z jakimś hardcoded height */
    max-height: calc(100vh - 86px);
`;

export const StartGameButtonWrapper = styled.div`
    position: absolute;
    right: 12px;

    .btn {
        font-size: 1.5rem;
        margin-top: -5px;
    }
`;

export const SettingsButton = styled(FiSettings)`
    margin-left: 12px;
    cursor: pointer;
`;
