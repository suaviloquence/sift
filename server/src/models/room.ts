import { RoomState } from "@sift/shared";
import { PlayerID } from ".";

export interface Room {
  state: RoomState;
  players: Set<PlayerID>;
}
