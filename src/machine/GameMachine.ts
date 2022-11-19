import { interpret, InterpreterFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { PlayerColor, Player, GridState, GameContext, GameStates, Position } from '../types';
import { currentPlayer } from '../utils/game';
import {
    chooseColorAction,
    dropTokenAction,
    joinGameAction,
    leaveGameAction,
    restartAction,
    saveWiningPos,
    setCurrentPlayerAction,
    switchPlayerAction,
} from './actions';
import {
    canChooseColorGuard,
    canDropGuard,
    canJoinGuard,
    canLeaveGuard,
    canStartGameGuard,
    isDrawMoveGuard,
    isWiningMoveGuard,
} from './guards';

// Pemet de créer le model du jeu pas obligatoire mais permet bc de sécu en type script
export const GameModel = createModel(
    // Context
    {
        players: [] as Player[],
        currentPlayer: null as null | Player['id'],
        rowLength: 4,
        grid: [
            ['E', 'E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E', 'E'],
        ] as GridState,
        winingPositions: [] as Position[],
    },
    {
        // List les événements afin de générer les évén à partir du GameModel
        events: {
            join: (playerId: Player['id'], name: Player['name']) => ({ playerId, name }),
            leave: (playerId: Player['id']) => ({ playerId }),
            chooseColor: (playerId: Player['id'], color: PlayerColor) => ({ playerId, color }),
            start: (playerId: Player['id']) => ({ playerId }),
            dropToken: (playerId: Player['id'], x: number) => ({ playerId, x }),
            restart: (playerId: Player['id']) => ({ playerId }),
        },
    }
);

// Création de la machine à état
export const GameMachine = GameModel.createMachine({
    id: 'game', // Id de machine
    context: GameModel.initialContext, // Context initial
    initial: GameStates.LOBBY, // Etat initial
    states: {
        // Différents états et tansition
        [GameStates.LOBBY]: {
            // Etat
            on: {
                join: {
                    // Transition
                    cond: canJoinGuard,
                    actions: [GameModel.assign(joinGameAction)],
                    target: GameStates.LOBBY, // Etat suivant
                },
                leave: {
                    cond: canLeaveGuard,
                    actions: [GameModel.assign(leaveGameAction)],
                    target: GameStates.LOBBY,
                },
                chooseColor: {
                    cond: canChooseColorGuard,
                    actions: [GameModel.assign(chooseColorAction)],
                    target: GameStates.LOBBY,
                },
                start: {
                    cond: canStartGameGuard,
                    actions: [GameModel.assign(setCurrentPlayerAction)],
                    target: GameStates.PLAY,
                },
            },
        },
        [GameStates.PLAY]: {
            after: {
                20000: {
                    actions: [GameModel.assign(switchPlayerAction)],
                    target: GameStates.PLAY,
                },
            },
            on: {
                dropToken: [
                    {
                        cond: isDrawMoveGuard,
                        actions: [GameModel.assign(dropTokenAction)],
                        target: GameStates.DRAW,
                    },
                    {
                        cond: isWiningMoveGuard,
                        actions: [GameModel.assign(saveWiningPos), GameModel.assign(dropTokenAction)],
                        target: GameStates.VICTORY,
                    },
                    {
                        cond: canDropGuard,
                        actions: [GameModel.assign(dropTokenAction), GameModel.assign(switchPlayerAction)],
                        target: GameStates.PLAY,
                    },
                ],
            },
        },
        [GameStates.VICTORY]: {
            on: {
                restart: {
                    actions: [GameModel.assign(restartAction)],
                    target: GameStates.LOBBY,
                },
            },
        },
        [GameStates.DRAW]: {
            on: {
                restart: {
                    actions: [GameModel.assign(restartAction)],
                    target: GameStates.LOBBY,
                },
            },
        },
    },
});

export const makeMachine = (
    state: GameStates = GameStates.LOBBY,
    context: Partial<GameContext> = {}
): InterpreterFrom<typeof GameMachine> => {
    const machine = interpret(
        GameMachine.withContext({
            ...GameModel.initialContext,
            ...context,
        })
    ).start();
    machine.state.value = state;
    return machine;
};
