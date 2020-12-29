import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import * as Views from './views';
import { history } from './store';

const App: React.FC = () => (
    <ConnectedRouter history={history}>
        <Switch>
            <Route path="/game" component={Views.GameView} />
            <Route path="/room" component={Views.GameRoomView} />
            <Route path="/" component={Views.LandingView} />
        </Switch>
    </ConnectedRouter>
);

export default App;
