import { HistoryRouter } from 'redux-first-history/rr6'
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import * as Views from './views';
import { history } from './store';

const App: React.FC = () => (
    <HistoryRouter history={history}>
        <Routes>
            <Route path="/game"><Views.GameView /></Route>
            <Route path="/room"><Views.GameRoomView /></Route>
            <Route path="/"><Views.LandingView /></Route>
        </Routes>
    </HistoryRouter>
);

export default App;
