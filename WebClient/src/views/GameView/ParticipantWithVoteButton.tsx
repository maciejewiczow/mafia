import { PhaseEnum, RoleEnum } from 'api';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { FaGhost, FaUserSecret } from 'react-icons/fa';
import { ParticipantWithNameAndRole } from 'store/Game/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
import * as roomSelectors from 'store/Rooms/selectors';
import { invokeVote } from 'store/Game/actions';
import { Participant, Badge, ParticipantName } from './parts';

export interface ParticipantProps {
    participant: ParticipantWithNameAndRole;
    phase: PhaseEnum;
    className?: string;
}

export const ParticipantWithVoteButton: React.FC<ParticipantProps> = ({ className, participant: user, phase }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(userSelectors.currentUser);
    const currentUserRoles = useSelector(gameSelectors.userRoles(currentUser?.id || ''));
    const currentGameState = useSelector(gameSelectors.currentGameState);
    const participants = useSelector(roomSelectors.participantsWithNames);
    const gameOpts = useSelector(roomSelectors.currentRoomOptions);

    const [shouldShowVoteButton, currentUserVote] = useMemo(() => {
        if (!currentUser || !currentGameState)
            return [undefined, undefined];

        const { voteState } = currentGameState;

        let showButton = false;

        // TODO: dodać do api metodę w stylu isVoteValid
        if (phase === PhaseEnum.Night)
            showButton = currentUserRoles.includes(RoleEnum.Mafioso) && !user.roles.includes(RoleEnum.Mafioso);
        else if (phase === PhaseEnum.Day)
            showButton = true;

        showButton = showButton && !currentUserRoles.includes(RoleEnum.Ghost) && !user.roles.includes(RoleEnum.Ghost);

        if (currentUser.id === user.id)
            showButton = false;

        const currUserVote = voteState.find(vote => vote.userId === currentUser.id);

        if (currUserVote)
            showButton = false;

        return [showButton, currUserVote];
    }, [currentGameState, currentUser, currentUserRoles, phase, user.id, user.roles]);

    const votesForUser = useMemo(() => (
        currentGameState?.voteState
            .filter(vote => vote.votedUserId === user.id)
            .map(vote => participants?.find(u => u.id === vote.userId)?.name)
    ), [currentGameState?.voteState, participants, user.id]);

    if (!gameOpts)
        return null;

    const { areVotesVisible } = gameOpts;

    const voteForUser = (userId: string) => () => {
        dispatch(invokeVote(userId));
    };

    let showVotes = votesForUser && votesForUser.length > 0 && areVotesVisible;

    if (phase === PhaseEnum.Night && !currentUserRoles.includes(RoleEnum.Mafioso))
        showVotes = false;

    return (
        <Participant className={className}>
            <ParticipantName
                isHighlighted={currentUserVote && currentUserVote.votedUserId === user.id}
            >
                {user.name}
            </ParticipantName>
            {' '}
            {(
                user.roles.includes(RoleEnum.Mafioso)
                && currentUserRoles.includes(RoleEnum.Mafioso)
                && <span><FaUserSecret title="Mafia" /> </span>
            )}
            {user.roles.includes(RoleEnum.Ghost) && <FaGhost title="Duch" />}
            {(user.id === currentUser?.id) && <Badge> (ty)</Badge> }
            {showVotes && (
                <span>({votesForUser?.join(', ')})</span>
            )}
            {shouldShowVoteButton && (
                <Button
                    variant="outline-primary"
                    onClick={voteForUser(user.id)}
                >
                    Zagłosuj
                </Button>
            )}
        </Participant>
    );
};
