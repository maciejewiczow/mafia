import { User } from '../../api';

export interface CurrentUserState {
    user?: User;
    isLoading: boolean;
}

export const initialCurrentUserState: CurrentUserState = {
    isLoading: false,
};
