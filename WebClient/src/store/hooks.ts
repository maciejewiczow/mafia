import { createSelectorHook } from 'react-redux';
import { AppState } from './constants';

export const useAppSelector = createSelectorHook<AppState>();
