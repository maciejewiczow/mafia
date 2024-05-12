import styled from 'styled-components';

export const ViewWrapper = styled.div`
    background: #e6e6e6;
    min-height: 100%;
    display: grid;

    grid-row-gap: 8px;

    grid-template-rows: 70px auto;
    grid-template-columns: 1fr;

    grid-template-areas:
        'header'
        'body';
`;
