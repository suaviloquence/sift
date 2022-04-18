import axios, { AxiosResponse } from "axios";

import { API as A, ClientToServer, ServerToClient } from "@sift/shared";
import { io, Socket as _Socket } from "socket.io-client";

export type Socket = _Socket<ServerToClient, ClientToServer>;

export default class API {
  readonly id!: string;
  readonly name!: string;
  readonly room!: string;

  constructor(id: string, name: string, room: string) {
    this.id = id;
    this.name = name;
    this.room = room;
  }

  private async post<Res, Req>(uri: string, body?: Req): Promise<Res> {
    const res = await axios.post<Res, AxiosResponse<Res>, Req>(uri, body, {
      headers: {
        Authorization: this.id,
      },
    });

    return res.data;
  }

  private async get<Res>(uri: string): Promise<Res> {
    const res = await axios.get(uri, {
      headers: {
        Authorization: this.id,
      },
    });
    return res.data;
  }

  public async roomState(): Promise<A.RoomState.Response> {
    return this.get<A.RoomState.Response>(`/api/${this.room}/state`);
  }

  public socket(): Socket {
    return io({
      path: "/socket/",
      auth: {
        id: this.id,
      },
    });
  }

  public static async join(name: string, room: string): Promise<API> {
    const res = await axios.post<
      A.Join.Response,
      AxiosResponse<A.Join.Response>,
      A.Join.Request
    >("/api/join", {
      name,
      room,
    });

    return new API(res.data.id, name, room);
  }

  public static async create(
    name: string,
    room: string,
    rounds: number,
    round_length: number
  ): Promise<API> {
    const res = await axios.post<
      A.Create.Response,
      AxiosResponse<A.Create.Response>,
      A.Create.Request
    >("/api/create", {
      name,
      room,
      rounds,
      round_length,
    });

    return new API(res.data.id, name, room);
  }
}
