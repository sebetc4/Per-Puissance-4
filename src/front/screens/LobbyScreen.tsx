import React from 'react';
import { PlayerColor } from '../../types';
import { ColorSelector, NameSelector } from '../components';
import { useGame } from '../hooks/useGame';

export default function LobbyScreen() {
    const { send, context, can } = useGame();
    const colors = [PlayerColor.YELLOW, PlayerColor.RED];

    const canStart = can({type: 'start'})
    const chooseColor = (color: PlayerColor) =>
        send({ type: 'chooseColor', color});
    const startGame = () => send({ type: 'start' });
    return (
        <div>
            <ColorSelector
                onSelect={chooseColor}
                players={context!.players}
                colors={colors}
            />
            <button
                className='button'
                onClick={startGame}
                disabled={!canStart}
            >
                Démarrer
            </button>
        </div>
    );
}
