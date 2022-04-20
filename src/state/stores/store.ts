import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import root from '../reducers/root';
import { createWrapper } from 'next-redux-wrapper';

export const store = createStore(root, composeWithDevTools(applyMiddleware(thunk)));
export const initStore = () => store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(initStore);
