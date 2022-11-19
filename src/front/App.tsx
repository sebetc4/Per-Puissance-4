import { GameStates, ServerErrors } from '../types';
import { currentPlayer } from '../utils/game';
import { Draw, Grid } from './components';
import { useGame } from './hooks/useGame';
import LobbyScreen from './screens/LobbyScreen';
import LoginScreen from './screens/LoginScreen';
import PlayScreen from './screens/PlayScreen';
import VictoryScreen from './screens/VictoryScreen';

export default function App() {
    const { state, context, can, send, playerId } = useGame();
    const showGrid = context && state !== GameStates.LOBBY;

    const dropToken = (x: number) => send({ type: 'dropToken', x });

    return !playerId ? (
        <LoginScreen />
    ) : (
        <div className='container'>
            {state === GameStates.LOBBY && <LobbyScreen />}
            {state === GameStates.PLAY && <PlayScreen />}
            {showGrid && (
                <Grid
                    grid={context!.grid}
                    onDrop={dropToken}
                    color={currentPlayer(context!)?.color}
                    winingPosition={context!.winingPositions}
                    canDrop={(x) => can({type: 'dropToken', x})}
                />
            )}
            {state === GameStates.VICTORY && <VictoryScreen />}
            {state === GameStates.DRAW && <Draw />}
        </div>
    );
}
