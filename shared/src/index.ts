export { ClientToServer, ServerToClient } from "./socket";

export {
  RoomState,
  Playing,
  Lobby,
  Results,
  MIN_ROOM_SIZE,
  Word,
  Leaderboard,
} from "./room";

export { MIN_WORD_LENGTH, pointValue } from "./words";

export * as API from "./api";

export function DBG<T>(x: T, depth: number = 4): T {
  console.dir(x, { depth });
  return x;
}
