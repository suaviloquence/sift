import { RoomState } from "./room";

export namespace RoomState {
  export type Response = RoomState;
}

export namespace Join {
  export interface Request {
    name: string;
    room: string;
  }

  export interface Response {
    id: string;
  }
}

export namespace Create {
  export interface Request {
    name: string;
    room: string;
    rounds: number;
    round_length: number;
  }

  export interface Response {
    id: string;
  }
}
