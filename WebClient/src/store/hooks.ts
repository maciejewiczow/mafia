import { createDispatchHook , createSelectorHook, UseSelector } from 'react-redux';
import { AppAction, AppState } from './constants';

export const useAppSelector = createSelectorHook() as UseSelector<AppState>;

export const useAppDispatch = createDispatchHook<AppState, AppAction>();
