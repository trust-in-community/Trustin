import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './functions/rootReducer';
import thunk from 'redux-thunk';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import fbConfig from './config/fbConfig';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { reduxFirestore, getFirestore } from 'redux-firestore'


const store = createStore(rootReducer,
    compose(
        applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
        reactReduxFirebase(fbConfig, {userProfile: 'users', useFirestoreForProfile: true, attachAuthIsReady: true}),
        reduxFirestore(fbConfig) // redux bindings for firestore
    )
);


store.firebaseAuthIsReady.then(() => {
    ReactDOM.render(
        <Provider store={ store }>
            <I18nextProvider i18n={i18n}>
                <App />
            </I18nextProvider>
        </Provider>, document.getElementById('root'));
    serviceWorker.register();
});
