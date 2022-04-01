import { RoomState } from "./room";

export namespace RoomState {
  export type Response = RoomState;
}

export namespace Connect {
  export interface Request {
    name: string;
    room: string;
  }

  export interface Response {
    id: string;
  }
}
