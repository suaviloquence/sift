import { RoomState } from "@sift/shared";
import { PlayerID } from ".";

export interface Room {
  state: RoomState;
  players: Set<PlayerID>;
  rounds_left: number;
  round_length: number;
  start_lock: boolean;
}
