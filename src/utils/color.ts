import { CellState, PlayerColor } from "../types";

export const discColor = (color: CellState) => {
    if (color === 'E') {
        return 'disc'
    }
    return `disc disc--${color === PlayerColor.YELLOW ? 'yellow' : 'red'}`;
};