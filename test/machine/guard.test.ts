import { beforeEach, describe, expect, it } from 'vitest';
import { interpret, InterpreterFrom } from 'xstate';
import { GameMachine, GameModel, makeMachine } from '../../src/machine/GameMachine';
import { canDropGuard, isWiningMoveGuard } from '../../src/machine/guards';
import { GameStates, PlayerColor } from '../../src/types';

describe('machine/guards', () => {
    describe('canJoinGame', () => {
        let machine: InterpreterFrom<typeof GameMachine>;
        beforeEach(() => {
            machine = interpret(GameMachine).start();
        });
        it('should let a player join', () => {
            expect(machine.send(GameModel.events.join('1', 'test1')).changed).toBe(true);
        });
        it("shouldn't let a player join twice ", () => {
            expect(machine.send(GameModel.events.join('1', 'test1')).changed).toBe(true);
            expect(machine.send(GameModel.events.join('1', 'test1')).changed).toBe(false);
        });
    });
    describe('canDropToken', () => {
        const machine = makeMachine(GameStates.PLAY, {
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
        it('should let player drop a token', () => {
            expect(canDropGuard(machine.state.context, GameModel.events.dropToken('1', 0))).toBe(true);
        });
        it('should not let player drop a token on filled columns', () => {
            expect(canDropGuard(machine.state.context, GameModel.events.dropToken('1', 6))).toBe(false);
        });
        it('should let player win', () => {
            expect(isWiningMoveGuard(machine.state.context, GameModel.events.dropToken('1', 5))).toBe(true);
        });
    });
});
