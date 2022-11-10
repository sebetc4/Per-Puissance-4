import { GameContext, GridState, Player, PlayerColor } from '../types';

export const freePosY = (grid: GridState, x: number): number => {
    for (let y = grid.length - 1; y >= 0; y--) {
        if (grid[y][x] === 'E') {
            return y;
        }
    }
    return -1;
};

export const winingPos = (grid: GridState, color: PlayerColor, x: number, size: number) => {
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ];

    const position = {
        y: freePosY(grid, x),
        x,
    };

    for (let direction of directions) {
        let items = [position];
        for (let forward of [1, -1]) {
            for (let i = 1; i < size; i++) {
                const x = position.x + i * direction[0] * forward;
                const y = position.y + i * direction[1] * forward;

                if (grid?.[y]?.[x] !== color) {
                    // ?. Permet de ne pas planter si undefined
                    break;
                }
                items.push({ x, y });
                console.log(x, y);
            }
            if (items.length >= size) {
                return items;
            }
        }
    }
    return [];
};

export const currentPlayer = (context: GameContext): Player => {
    const player = context.players.find((p) => p.id === context.currentPlayer);
    if (player === undefined) {
        throw new Error('Impossible de récupérer le joueur courant');
    }
    return player;
};

export const countEmptyCell = (grid: GridState): number => {
    let count = 0;
    for (let row of grid) {
        for (let cell of row) {
            cell === 'E' && count++
        }
    }
    return count
};
