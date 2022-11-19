import React from 'react';
import { Player, PlayerColor } from '../../types';
import { discColor } from '../../utils/color';

type ColorSelectorProps = {
    onSelect: (color: PlayerColor) => void;
    players: Player[];
    colors: PlayerColor[];
};

export default function ColorSelector({ onSelect, players, colors }: ColorSelectorProps) {
    return (
        <>
            <div className='players'>
                {players.map((player) => (
                    <div
                        key={player.id}
                        className='player'
                    >
                        {player.name}
                        {player.color && <div className={discColor(player.color)}></div>}
                    </div>
                ))}
            </div>
            <h3>Sélectionnez une couleur</h3>
            <div className='selector'>
                {colors.map((color) => (
                    <button
                        onClick={() => onSelect(color)}
                        key={color}
                    >
                        <div className={discColor(color)} />
                    </button>
                ))}
            </div>
        </>
    );
}
