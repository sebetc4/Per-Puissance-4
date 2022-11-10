import { GameAction, GameContext, PlayerColor } from '../types';
import { currentPlayer, freePosY, winingPos } from '../utils/game';
import { GameModel } from './GameMachine';

export const joinGameAction: GameAction<'join'> = (context, event) => ({
    players: [...context.players, { id: event.playerId, name: event.name }],
});

export const leaveGameAction: GameAction<'leave'> = (context, event) => ({
    players: context.players.filter((player) => player.id !== event.playerId),
});

export const dropTokenAction: GameAction<'dropToken'> = ({ grid, players }, { x: eventX, playerId }) => {
    const playerColor = players.find((p) => playerId === p.id)!.color!;
    const eventY = freePosY(grid, eventX);
    const newGrid = grid.map((row, y) =>
        row.map((valCell, x) => (x === eventX && y === eventY ? playerColor : valCell))
    );
    return {
        grid: newGrid,
    };
};

export const switchPlayerAction = (context: GameContext) => ({
    currentPlayer: context.players.find((p) => p.id !== context.currentPlayer)!.id,
});

export const saveWiningPos: GameAction<'dropToken'> = (context, event) => ({
    winingPositions: winingPos(context.grid, currentPlayer(context).color!, event.x, context.rowLength),
});

export const restartAction: GameAction<'restart'> = (context) => ({
    winingPositions: [],
    grid: GameModel.initialContext.grid,
    currentPlayer: null
})

export const setCurrentPlayerAction = (context: GameContext) => ({
    currentPlayer: context.players.find(p => p.color === PlayerColor.YELLOW)!.id
})

export const chooseColorAction: GameAction<'chooseColor'> = (context, event) => ({
    players: context.players.map(p => {
        if (p.id === event.playerId) {
            return {...p, color: event.color}
        }
        return p
    })
})
