import { ContextFrom, EventFrom } from 'xstate';
import { GameModel } from './machine/GameMachine';

export enum PlayerColor {
    RED = 'R',
    YELLOW = 'Y',
}

export type Player = {
    id: string;
    name: string;
    color?: PlayerColor; //Par défaut les joueur n'ont pas forcement de couleur
}

export type CellEmpty = 'E'; //Cellule vide
export type CellState = PlayerColor.RED | PlayerColor.YELLOW | CellEmpty | 'R' | 'Y'; //Etat de cellule  ('R' | 'Y' pour les tests)

export type Position = {
    x: number;
    y: number;
}

export type GridState = CellState[][];

// Etats de la machine (enum nomé pour le debug)
export enum GameStates {
    LOBBY = 'LOBBY',
    PLAY = 'PLAY',
    VICTORY = 'VICTORY',
    DRAW = 'DRAW',
}

export type GameContext = ContextFrom<typeof GameModel>; //Context de jeu
export type GameEvents = EventFrom<typeof GameModel>;

export type GameEvent<T extends GameEvents['type']> = GameEvents & { type: T };

export type GameGuard<T extends GameEvents['type']> = (context: GameContext, event: GameEvent<T>) => boolean;

export type GameAction<T extends GameEvents['type']> = (
    context: GameContext,
    event: GameEvent<T>
) => Partial<GameContext>;
