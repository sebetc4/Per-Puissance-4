import { PlayerColor } from '../../types';
import { discColor } from '../../utils/color';
import { prevent } from '../../utils/dom';

interface DrawProps {
    onRestart?: () => void;
}

export default function Victory({onRestart }: DrawProps) {
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
                Egalité!!
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
