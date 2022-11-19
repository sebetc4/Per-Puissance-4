import React from 'react';
import { PlayerSession, QueryParams } from '../../types';
import { NameSelector } from '../components';
import { saveSession } from '../utils/session';
import { updateQueryParams, urlSearchParams } from '../utils/url';
import { v4 as uuid } from 'uuid';
import { useGame } from '../hooks/useGame';

type LoginScreenProps = {};

export default function LoginScreen() {
    const { connect } = useGame();
    const handleLogin = async (name: string) => {
        const res: PlayerSession = await fetch('api/player', { method: 'POST' }).then((res) => res.json());
        const player = saveSession({
            ...res,
            name,
        });
        const gameId = urlSearchParams().get(QueryParams.GAMEID) ?? uuid();
        connect(player, gameId);
        // updateQueryParams({[QueryParams.GAMEID]: gameId})
    };
    return (
        <NameSelector
            disabled={false}
            onSelect={handleLogin}
        />
    );
}
