import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    text-align: center;
`;

const Header = styled.header`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
`;

const AppLink = styled.a`
    color: #61dafb;
`;

const App = () => (
    <Wrapper>
        <Header>
            <p>Edit <code>src/App.tsx</code> and save to reload.</p>
            <AppLink
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </AppLink>
        </Header>
    </Wrapper>
);

export default App;
