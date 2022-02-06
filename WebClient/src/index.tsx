import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import reportWebVitals from './reportWebVitals';

import store from './store';
import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const GlobalStyles = createGlobalStyle`
    body, html, #root {
        height: 100vh;
        overflow: auto;
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    input, button {
        padding: 3px 5px;
    }
`;

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <GlobalStyles />
            <App />
        </Provider>
        <ToastContainer
            position="bottom-center"
            autoClose={4000}
            limit={5}
            rtl={false}
            transition={Slide}
            style={{ width: '40vw' }}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
