import { CSSProperties } from 'react';
import { CellState, GridState, PlayerColor } from '../../types';
import { discColor } from '../../utils/color';
import { prevent } from '../../utils/dom';

type GridProps = {
    color?: PlayerColor;
    grid: GridState;
    onDrop?: (x: number) => void;
};

export default function Grid({ color, grid, onDrop }: GridProps) {
    const cols = grid[0].length;
    const showColumns = color && onDrop;
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
                    />
                ))
            )}
            {showColumns && (
                <div className='columns'>
                    {new Array(cols).fill(1).map((_, i) => (
                        <Column
                            key={i}
                            color={color}
                            onDrop={() => onDrop(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

type ColumnProps = {
    color: PlayerColor;
    onDrop: () => void;
};

function Column({ color, onDrop }: ColumnProps) {
    return (
        <button
            className='column'
            onClick={prevent(onDrop)}
        >
            <div
                className={discColor(color)}
                onDrop={onDrop}
            ></div>
        </button>
    );
}

type CellProps = {
    x: number;
    y: number;
    color: CellState;
};

function Cell({ x, y, color }: CellProps) {
    return (
        <div
            className={discColor(color)}
            style={{ '--row': y } as CSSProperties}
        />
    );
}
