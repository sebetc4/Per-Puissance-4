import { CSSProperties } from 'react';
import { CellState, GridState, PlayerColor, Position } from '../../types';
import { discColor } from '../../utils/color';
import { prevent } from '../../utils/dom';

type GridProps = {
    color?: PlayerColor;
    grid: GridState;
    onDrop: (x: number) => void;
    winingPosition: Position[];
    canDrop: (x: number) => boolean;
};

export default function Grid({ color, grid, onDrop, winingPosition, canDrop }: GridProps) {
    const cols = grid[0].length;
    const showColumns = color && onDrop;
    const isWining = (x: number, y: number) => !!winingPosition.find((p) => p.x === x && p.y === y);
    return (
        <div
            className='grid'
            style={{ '--rows': grid.length, '--cols': cols } as CSSProperties}
        >
            {grid.map((row, y) =>
                row.map((color, x) => (
                    <Cell
                        x={x}
                        y={y}
                        color={color}
                        key={`${x}-${y}`}
                        isWining={isWining(x, y)}
                    />
                ))
            )}
            {showColumns && (
                <div className='columns'>
                    {new Array(cols).fill(1).map((_, i) => (
                        <Column
                            x={i}
                            key={i}
                            color={color}
                            onDrop={onDrop}
                            disabled={!canDrop(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

type ColumnProps = {
    x: number;
    color: PlayerColor;
    disabled?: boolean;
    onDrop: (x: number) => void;
};

function Column({ x, color, disabled, onDrop }: ColumnProps) {
    return (
        <button
            className='column'
            onClick={prevent(() => onDrop(x))}
            disabled={disabled}
        >
            <div className={discColor(color)}/>
        </button>
    );
}

type CellProps = {
    x: number;
    y: number;
    color: CellState;
    isWining: boolean;
};

function Cell({ x, y, color, isWining }: CellProps) {
    return (
        <div
            className={`${discColor(color)} ${isWining ? 'wining' : ''}`}
            style={{ '--row': y } as CSSProperties}
        />
    );
}
