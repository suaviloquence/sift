import { Leaderboard, RoomState } from "./room";

export interface ServerToClient {
  state_change: (state: RoomState) => void;
  join: (name: string) => void;
  finale: (leaderboard: Leaderboard) => void;
}

export interface ClientToServer {
  start: () => void;
  word: (word: string) => void;
}
