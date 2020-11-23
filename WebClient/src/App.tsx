import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { getAccessToken } from './api/tokens';
import { getCurrentUser } from './store/User/actions';

import * as Views from './views';

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if ((await getAccessToken()) !== null) {
                console.log('Access token present user data request');
                dispatch(getCurrentUser());
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <HashRouter>
            <Switch>
                <Route path="/" component={Views.LandingView} />
            </Switch>
        </HashRouter>
    );
};

export default App;
