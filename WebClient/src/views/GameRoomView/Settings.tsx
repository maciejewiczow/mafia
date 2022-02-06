import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { saveGameOptions, updateGameOptions } from 'store/Rooms/actions';
import { currentRoomOptions } from 'store/Rooms/selectors';
import { DurationPicker } from './DurationPicker';
import { SettingsWrapper } from './parts';

export const Settings: React.FC = () => {
    const dispatch = useDispatch();

    const currentRoomOpts = useSelector(currentRoomOptions);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(saveGameOptions());
    };

    if (!currentRoomOpts)
        return null;

    return (
        <SettingsWrapper>
            <h4>Ustawienia gry</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="maxPlayers">
                    <Form.Label>Maksymalna ilość graczy w pokoju</Form.Label>
                    <Form.Control
                        type="number"
                        min="3"
                        step="1"
                        value={currentRoomOpts.maxPlayers}
                        onChange={e => dispatch(updateGameOptions({ maxPlayers: +e.target.value }))}
                    />
                </Form.Group>
                <Form.Group controlId="mafiosoCount">
                    <Form.Label>Ilość członków mafii</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        step="1"
                        value={currentRoomOpts.mafiosoCount}
                        onChange={e => dispatch(updateGameOptions({ mafiosoCount: +e.target.value }))}
                    />
                </Form.Group>
                <Form.Group controlId="phaseDuration">
                    <Form.Label>Długość rundy</Form.Label>
                    <DurationPicker
                        value={currentRoomOpts.phaseDuration}
                        onChange={duration => dispatch(updateGameOptions({ phaseDuration: duration }))}
                    />
                </Form.Group>
                <Form.Group controlId="isPublic">
                    <Form.Check
                        type="checkbox"
                        checked={currentRoomOpts.isPublic}
                        label="Pokój publiczny"
                        onChange={e => dispatch(updateGameOptions({ isPublic: e.target.checked }))}
                    />
                </Form.Group>
                <Form.Group controlId="votesVisible">
                    <Form.Check
                        type="checkbox"
                        checked={currentRoomOpts.areVotesVisible}
                        label="Głosy widoczne dla innych graczy"
                        onChange={e => dispatch(updateGameOptions({ areVotesVisible: e.target.checked }))}
                    />
                </Form.Group>
                <Button type="submit" variant="outline-primary">Zapisz</Button>
            </Form>
        </SettingsWrapper>
    );
};
