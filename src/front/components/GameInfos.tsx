import { PlayerColor } from '../../types';
import { discColor } from '../../utils/color';

interface GameInfosProps {
    color: PlayerColor;
    name: string
}

export default function GameInfos({ color, name }: GameInfosProps) {
    return (
        <div>
            <h2 className='flex' style={{gap: '.5rem'}}>
                Au tour de {name}
                <div className={discColor(color)}/>
                de jouer
            </h2>
        </div>
    );
}
