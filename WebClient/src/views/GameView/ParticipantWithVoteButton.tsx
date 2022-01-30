import { PhaseEnum, RoleEnum } from 'api';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { FaGhost, FaUserSecret } from 'react-icons/fa';
import { ParticipantWithNameAndRole } from 'store/Game/selectors';
import * as userSelectors from 'store/User/selectors';
import * as gameSelectors from 'store/Game/selectors';
import { participantsWithNames } from 'store/Rooms/selectors';
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
    const participants = useSelector(participantsWithNames);

    if (!currentUser || !currentGameState)
        return null;

    const { voteState } = currentGameState;

    let shouldShowVoteButton = false;

    // TODO: dodać do api metodę w stylu isVoteValid
    if (phase === PhaseEnum.Night)
        shouldShowVoteButton = currentUserRoles.includes(RoleEnum.Mafioso) && !user.roles.includes(RoleEnum.Mafioso);
    else if (phase === PhaseEnum.Day)
        shouldShowVoteButton = true;

    shouldShowVoteButton = shouldShowVoteButton && !currentUserRoles.includes(RoleEnum.Ghost) && !user.roles.includes(RoleEnum.Ghost);

    if (currentUser?.id === user.id)
        shouldShowVoteButton = false;

    const currentUserVote = voteState.find(vote => vote.userId === currentUser?.id);

    if (currentUserVote)
        shouldShowVoteButton = false;

    const userVote = voteState.find(vote => vote.userId === user.id);

    let votedUserName;

    if (userVote)
        votedUserName = participants?.find(u => u.id === userVote.votedUserId)?.name;

    const voteForUser = (userId: string) => () => {
        dispatch(invokeVote(userId));
    };

    return (
        <Participant>
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
            {votedUserName && (
                <span> -&gt; {votedUserName}</span>
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
