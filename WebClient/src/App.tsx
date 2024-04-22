import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6'
import { history } from './store';
import * as Views from './views';

export const App: React.FC = () => (
    <HistoryRouter history={history}>
        <Routes>
            <Route path="/game" Component={Views.GameView} />
            <Route path="/room" Component={Views.GameRoomView} />
            <Route path="/" Component={Views.LandingView} />
        </Routes>
    </HistoryRouter>
);
