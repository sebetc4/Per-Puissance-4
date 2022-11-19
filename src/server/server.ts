import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyWebsocket from '@fastify/websocket';
import { v4 as uuid } from 'uuid';
import { sign, verify } from './utils/crypto';
import { resolve } from 'path';
import { ServerErrors } from '../types';
import { ConnectionRepository } from './repositories/ConnectionRepository';
import { gameRepository } from './repositories/GameRepository';
import { GameModel } from '../machine/GameMachine';
import { publishMachine } from './utils/socket';
import { readFileSync } from 'fs';
import FastifyView from '@fastify/view';
import ejs from 'ejs';

const connections = new ConnectionRepository();
const games = new gameRepository(connections);
const env = process.env.NODE_ENV as 'dev' | 'prod';
let manifest = {};

try {
    const manifestData = readFileSync('./public/assets/manifest.json');
    manifest = JSON.parse(manifestData.toLocaleString());
} catch (err) {
    console.log(err);
}

const fastify = Fastify({ logger: true });
fastify.register(FastifyView, {
    engine: {
        ejs,
    },
});

fastify.register(FastifyStatic, {
    root: resolve('./public'),
});

fastify.register(FastifyWebsocket);

fastify.register(async (f) => {
    f.get('/ws', { websocket: true }, (connection, req) => {
        const query = req.query as Record<string, string>;
        const playerId = query.playerId ?? '';
        const signature = query.signature ?? '';
        const playerName = query.name || 'Test User';
        const gameId = query.gameId;

        if (!gameId) {
            connection.end();
            f.log.error('Pas de gameId');
            return;
        }
        if (!verify(playerId, signature)) {
            f.log.error("Erreur d'authentification");
            connection.socket.send(JSON.stringify({ type: 'error', code: ServerErrors.AuthError }));
            return;
        }

        const game = games.find(gameId) ?? games.create(gameId);
        connections.persist(playerId, gameId, connection);

        game.send(GameModel.events.join(playerId, playerName));

        publishMachine(game.state, connection);

        connection.socket.on('message', (rawMessage) => {
            const message = JSON.parse(rawMessage.toLocaleString());
            if (message.type === 'gameUpdate') {
                game.send(message.event);
            }
        });

        connection.socket.on('close', () => {
            connections.remove(playerId, gameId);
            game.send(GameModel.events.leave(playerId));
        });
    });
});

fastify.get('/', (req, res) => {
    res.view('/template/index.ejs', { manifest, env });
});

fastify.post('/api/player', (req, res) => {
    const playerId = uuid();
    const signature = sign(playerId);
    res.send({ playerId, signature });
});

fastify
    .listen({ port: 8000 })
    .catch((err) => {
        fastify.log.error(err);
        process.exit(1);
    })
    .then(() => {
        fastify.log.info(`Listening on port 8000`);
    });
