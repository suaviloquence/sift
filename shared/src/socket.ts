import { RoomState } from "./room";

export interface ServerToClient {
  state_change: (state: RoomState) => void;
  join: (name: string) => void;
}

export interface ClientToServer {
  start: () => void;
  word: (word: string) => void;
}
