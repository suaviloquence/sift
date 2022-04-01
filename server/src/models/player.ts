import { RoomCode } from ".";

export interface Player {
  name: string;
  room: RoomCode;
  score: number;
  words: string[];
}
