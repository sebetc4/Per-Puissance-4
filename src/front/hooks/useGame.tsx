import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import {
    GameContext,
    GameEvent,
    GameEvents,
    GameStates,
    Player,
    PlayerSession,
    QueryParams,
    ServerErrors,
} from '../../types';
import { useMachine } from '@xstate/react';
import { GameMachine, makeMachine } from '../../machine/GameMachine';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { urlSearchParams } from '../utils/url';
import { getSession, logout } from '../utils/session';
import { InterpreterFrom } from 'xstate';

type GameContextType = {
    state?: GameStates;
    context?: GameContext;
    connect: (session: PlayerSession, gameId: string) => void;
    send: <T extends GameEvents['type']>(
        event: { type: T; playerId?: string } & Omit<GameEvent<T>, 'playerId'>
    ) => void;
    can: <T extends GameEvents['type']>(
        event: { type: T; playerId?: string } & Omit<GameEvent<T>, 'playerId'>
    ) => boolean;
    playerId: Player['id'];
};

const Context = createContext<GameContextType>({} as any);

export function useGame(): GameContextType {
    return useContext(Context);
}

export function GameContextProvider({ children }: PropsWithChildren) {
    const [machine, setMachine] = useState<InterpreterFrom<typeof GameMachine> | null>(null);
    const [playerId, setPlayerId] = useState('');
    const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);
    const sendWithPlayer = useCallback<GameContextType['send']>(
        (e) => {
            const event = { playerId, ...e };
            socket?.send(JSON.stringify({type: 'gameUpdate', event}))
        },
        [playerId]
    );
    const canWithPlayer = useCallback<GameContextType['can']>(
        (event) => !!GameMachine.transition(machine?.state, { playerId, ...event } as GameEvents).changed,
        [machine?.state, playerId]
    );
    const connect: GameContextType['connect'] = (session, gameId) => {
        const searchParams = new URLSearchParams({
            ...session,
            gameId,
        });
        setPlayerId(session.playerId);
        const socket = new ReconnectingWebSocket(
            `${window.location.protocol.replace('http', 'ws')}//${window.location.host}/ws?${searchParams.toString()}`
        );
        setSocket(socket);
    };

    useEffect(() => {
        console.log(socket, playerId)
        if (!socket) {
            const gameId = urlSearchParams().get(QueryParams.GAMEID);
            const session = getSession();
            console.log(session)
            if (gameId && session) {
                connect(session, gameId);
                setPlayerId(session.playerId);
            }
            return;
        }
        const onMessage = (e: MessageEvent) => {
            const message = JSON.parse(e.data);
            if (message.type === 'error' && message.code === ServerErrors.AuthError) {
                logout();
                setPlayerId('');
            } else if (message.type === 'gameUpdate') {
                setMachine(makeMachine(message.state, message.context));
            }
        };
        socket.addEventListener('message', onMessage);
        return () => {
            socket.removeEventListener('message', onMessage);
        };
    }, [socket]);
    return (
        <Context.Provider
            value={{
                playerId,
                state: machine?.state.value as GameStates,
                context: machine?.state.context,
                send: sendWithPlayer,
                can: canWithPlayer,
                connect,
            }}
        >
            {children}
        </Context.Provider>
    );
}
