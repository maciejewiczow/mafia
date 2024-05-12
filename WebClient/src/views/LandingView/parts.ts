import { CreateUser, RoomList } from 'modules';
import styled from 'styled-components';

export const Header = styled.header`
    background-color: #282c34;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: calc(15px + 2vmin);
    color: white;
    padding: 16px;

    grid-area: header;
`;

export const ContentWrapper = styled.div`
    padding: 0 12px;

    grid-area: body;

    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-gap: 8px;

    grid-template-areas: 'user rooms';
`;

export const RoomListArea = styled(RoomList)`
    grid-area: rooms;
    max-width: 100%;
`;

export const UserArea = styled(CreateUser)`
    grid-area: user;
    height: 130px;
`;
