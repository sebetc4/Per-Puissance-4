import { PlayerSession } from '../../types';

export const saveSession = (session: PlayerSession): PlayerSession => {
    localStorage.setItem('playerId', session.playerId);
    localStorage.setItem('signature', session.signature);
    localStorage.setItem('name', session.name);
    return session;
};

export const getSession = (): PlayerSession | null => {
    const playerId = localStorage.getItem('playerId');
    const signature = localStorage.getItem('signature');
    const name = localStorage.getItem('name');
    if (!signature || !name || !playerId) {
        return null;
    }
    return { playerId, signature, name };
};

export const logout = (): void => {
    localStorage.clear();
}