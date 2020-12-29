import watchers from './gameSagas';
import signalrWatchers from './signalRSagas';

export default {
    ...watchers,
    ...signalrWatchers,
};
