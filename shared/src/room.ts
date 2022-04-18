export interface Lobby {
  state: "lobby";
  leaderboard: Leaderboard;
}

interface LobbyPlayer {
  name: string;
  score: number;
}

export type Leaderboard = LobbyPlayer[];

export interface Playing {
  state: "playing";
  letters: string[];
  end: number;
}

export interface Word {
  word: string;
  valid: boolean;
}

interface ResultsPlayer {
  name: string;
  score: number;
  scoreChange: number;
  words: Word[];
}

export interface Results {
  state: "results";
  players: ResultsPlayer[];
  next: number;
}

export type RoomState = Lobby | Playing | Results;

export const MIN_ROOM_SIZE = 1;
