import { beforeEach, describe, expect, it } from 'vitest';
import { interpret, InterpreterFrom } from 'xstate';
import { GameMachine, GameModel, makeMachine } from '../../src/machine/GameMachine';
import { canDropGuard } from '../../src/machine/guards';
import { GameContext, GameStates, PlayerColor } from '../../src/types';

describe('machine/actions', () => {
    describe('join', () => {
        let machine: InterpreterFrom<typeof GameMachine>;
        beforeEach(() => {
            machine = interpret(GameMachine).start();
        });
        it('add a player', () => {
            expect(machine.send(GameModel.events.join('1', 'test1')).changed).toBe(true);
            expect(machine.state.context.players).toHaveLength(1);
        });
    });
    describe('droptoken', () => {
        let machine: InterpreterFrom<typeof GameMachine>;

        beforeEach(() => {
            machine = makeMachine(GameStates.PLAY, {
                players: [
                    {
                        id: '1',
                        name: '1',
                        color: PlayerColor.RED,
                    },
                    {
                        id: '2',
                        name: '2',
                        color: PlayerColor.YELLOW,
                    },
                ],
                currentPlayer: '1',
                grid: [
                    ['E', 'E', 'E', 'E', 'E', 'E', 'R'],
                    ['E', 'E', 'E', 'E', 'E', 'R', 'Y'],
                    ['E', 'E', 'E', 'E', 'E', 'R', 'R'],
                    ['E', 'E', 'E', 'E', 'E', 'R', 'Y'],
                    ['E', 'E', 'E', 'E', 'E', 'Y', 'R'],
                    ['E', 'E', 'E', 'E', 'E', 'Y', 'Y'],
                ],
            });
        });
        it('should let me drop a token', () => {
            expect(machine.send(GameModel.events.dropToken('1', 0)).changed).toBe(true);
            expect(machine.state.context.grid[5][0]).toBe(PlayerColor.RED);
            expect(machine.state.value).toBe(GameStates.PLAY);
            expect(machine.state.context.currentPlayer).toBe('2');
        });
        it('should not let me drop a token on filled columns', () => {
            expect(machine.send(GameModel.events.dropToken('1', 6)).changed).toBe(false);
        });
        it('should make me win', () => {
            expect(machine.send(GameModel.events.dropToken('1', 5)).changed).toBe(true);
            expect(machine.state.value).toBe(GameStates.VICTORY);
            expect(machine.state.context.winingPositions).toHaveLength(4);
        });
        it('should handle draw', () => {
            machine = makeMachine(GameStates.PLAY, {
                ...machine.state.context,
                grid: [
                    ['E', 'R', 'Y', 'R', 'Y', 'Y', 'R'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                    ['R', 'Y', 'R', 'Y', 'Y', 'R', 'Y'],
                ],
            });
            expect(machine.send(GameModel.events.dropToken('1', 0)).changed).toBe(true);
            expect(machine.state.value).toBe(GameStates.DRAW);
        });
    });
});
