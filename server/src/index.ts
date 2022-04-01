import http from "http";
import crypto from "crypto";

import express from "express";
import bodyParser from "body-parser";

import { config as dotenv } from "dotenv";

import { Player, RoomCode, SocketID, PlayerID, Room } from "./models";
import { Server } from "socket.io";
import {
  ClientToServer,
  API,
  ServerToClient,
  RoomState,
  Lobby,
  pointValue,
  MIN_WORD_LENGTH,
  MIN_ROOM_SIZE,
  DBG,
} from "@sift/shared";
import { getWords } from "./words";
import { Results } from "@sift/shared/dist/room";

dotenv();

const app = express();
const server = http.createServer(app);
const io: Server<ClientToServer, ServerToClient> = new Server(server, {
  path: "/socket/",
});

const sockets: Map<SocketID, PlayerID> = new Map();
const players: Map<PlayerID, Player> = new Map();
const rooms: Map<RoomCode, Room> = new Map();

let words: Set<string> = new Set();

getWords().then((w) => (words = w));

function changeState(room_code: RoomCode, state: RoomState) {
  const room = rooms.get(room_code) as Room;

  room.state = state;
  io.to(room_code).emit("state_change", state);
}

/**
 * @returns tuple of score and unique valid words for the results
 */
function calculateScores(player: Player): [number, Set<string>] {
  const valid = new Set<string>();
  let score = 0;

  for (const word of player.words) {
    if (word.length < MIN_WORD_LENGTH || valid.has(word) || !words.has(word))
      continue;
    score += pointValue(word);
    valid.add(word);
  }

  return [score, valid];
}

/**
 * @returns calculated state and maximum words (for time calculation)
 */
function calculateResults(
  player_ids: Iterable<PlayerID>
): [Results["players"], number] {
  let max_words = 0;

  return [
    Array.from(player_ids, (player_id) => {
      const player = players.get(player_id) as Player;
      const [scoreChange, valid] = calculateScores(player);
      player.score += scoreChange;

      max_words = Math.max(max_words, player.words.length);

      return {
        name: player.name,
        score: player.score,
        scoreChange,
        words: player.words.map((word) => ({
          word,
          valid: valid.delete(word),
        })),
      };
    }).sort((a, b) => b.score - a.score),
    max_words,
  ];
}

function generateLeaderboard(player_ids: Iterable<PlayerID>): Lobby {
  return {
    state: "lobby",
    leaderboard: Array.from(player_ids, (player_id) => {
      const player = players.get(player_id) as Player;
      return {
        name: player.name,
        score: player.score,
      };
    }).sort((a, b) => b.score - a.score), // sort by score, but reverse it (so greatest is first)
  };
}

io.use((socket, next) => {
  const { id: player_id } = socket.handshake.auth;

  if (typeof player_id !== "string" || !players.has(player_id))
    return next(new Error("Unauthorized"));

  sockets.set(socket.id, player_id);

  next();
});

io.on("connection", (socket) => {
  const player_id = sockets.get(socket.id);
  if (!player_id) return;

  const player = players.get(player_id);
  if (!player) return;

  const room_code = player.room;

  console.log(`Player "${player.name}" connected (socket id ${socket.id})`);

  socket.join(room_code);
  io.to(room_code).emit("join", player.name);

  const room = rooms.get(room_code) as Room;

  socket.on("start", () => {
    if (!room || room.players.size < MIN_ROOM_SIZE) return;

    console.log(`Starting room ${player.room}`);

    const DELAY = 10 * 1000; // 30 seconds

    setTimeout(() => {
      const [players, max_words] = calculateResults(room.players);
      const next_delay = (max_words * 1 + 5) * 1000;
      changeState(room_code, {
        state: "results",
        players,
        next: Date.now() + next_delay,
      });

      setTimeout(
        () => changeState(room_code, generateLeaderboard(room.players)),
        next_delay
      );
    }, DELAY);

    room.players.forEach(
      (player_id) => ((players.get(player_id) as Player).words.length = 0)
    );

    changeState(room_code, {
      state: "playing",
      letters: generateLetters(),
      end: Date.now() + DELAY,
    });
  });

  socket.on("word", (word) => player.words.push(word));
});

app.use(bodyParser.json());

app.post<never, API.Connect.Response, API.Connect.Request>(
  "/api/connect",
  (req, res) => {
    const { name, room: room_code } = req.body;

    if (typeof name !== "string" || typeof room_code !== "string")
      return res.sendStatus(400);

    const player_id: PlayerID = crypto.randomUUID();

    const player = {
      name,
      room: room_code,
      score: 0,
      words: [],
    };

    players.set(player_id, player);

    if (rooms.has(room_code)) {
      const room = rooms.get(room_code) as Room;
      room.players.add(player_id);
      if (room.state.state === "lobby") {
        room.state = generateLeaderboard(room.players);
      }
    } else {
      rooms.set(room_code, {
        state: generateLeaderboard([player_id]),
        players: new Set([player_id]),
      });
    }

    res.json({ id: player_id });
  }
);

app.get<"/api/:room/state", { room: string }, API.RoomState.Response>(
  "/api/:room/state",
  (req, res) => {
    const room = rooms.get(req.params.room);

    if (!room) return res.sendStatus(400);

    const player_id = req.headers.authorization;

    if (!player_id) return res.sendStatus(400);
    if (!room.players.has(player_id)) return res.sendStatus(401);

    res.json(room.state);
  }
);

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT ?? 3000
    : process.env.DEV_SERVER_PORT ?? 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(`${__dirname}/static`));
}

server.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});

function generateLetters(): string[] {
  const SIZE = 9;
  const letters = new Array(SIZE);

  const VOWELS = Array.from("aeiou");
  const CONSONANTS = Array.from("bcdfghjklmnpqrstvwxyz");
  const COMMON = Array.from("elnrst"); // one-point consonants in scrabble + e

  function choice<T>(arr: T[]): T {
    return arr[crypto.randomInt(arr.length)];
  }

  for (let i = 0; i < SIZE; i++)
    letters[i] = choice(i % 2 == 0 ? CONSONANTS : i % 3 == 1 ? VOWELS : COMMON);

  return letters;
}
