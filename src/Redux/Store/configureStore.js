import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../Reducers';

export default function configureStore(initialState = {}) {
    const middleware = [thunkMiddleware];
    const composeEnhancers =
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
            }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware),
        // other store enhancers if any
    );
    return createStore(
        rootReducer,
        initialState,
        enhancer
    )
}