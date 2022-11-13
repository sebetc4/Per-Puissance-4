import React from 'react';
import { PlayerColor } from '../../types';
import { discColor } from '../../utils/color';
import { prevent } from '../../utils/dom';

interface VictoryProps {
    color: PlayerColor;
    name: string;
    onRestart?: () => void;
}

export default function Victory({ color, name, onRestart }: VictoryProps) {
    return (
        <div
            className='flex'
            style={{
                justifyContent: 'space-between' 
            }}
        >
            <h2
                className='flex'
                style={{ gap: '.5rem' }}
            >
                Beavo, {name}
                <div className={discColor(color)} />à gagné!!
            </h2>
            <button
                className='button'
                onClick={prevent(onRestart)}
            >
                Rejouer
            </button>
        </div>
    );
}
