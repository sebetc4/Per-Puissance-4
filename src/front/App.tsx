import { PlayerColor } from '../types';
import { ColorSelector, Grid, NameSelector, PlayScreen, VictoryScreen } from './components';


function App() {
    return (
        <div className='container'>
            <NameSelector
                disabled={false}
                onSelect={() => null}
            />
            <hr />
            <ColorSelector
                onSelect={() => null}
                players={[
                    {
                        id: '1',
                        name: 'John',
                        color: PlayerColor.RED,
                    },
                    {
                        id: '2',
                        name: 'Marc',
                        color: PlayerColor.YELLOW,
                    },
                ]}
                colors={[PlayerColor.RED, PlayerColor.YELLOW]}
            />
            <hr />
            <PlayScreen
                color={PlayerColor.RED}
                name='John'
            />
            <hr />
            <VictoryScreen
                color={PlayerColor.RED}
                name='John'
            />
            <hr />
            <Grid
                color={PlayerColor.RED}
                grid={[
                    ['E', 'R', 'Y', 'R', 'Y', 'Y', 'R'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                ]}
                onDrop={() => null}
            />
            <hr />
        </div>
    );
}

export default App;
