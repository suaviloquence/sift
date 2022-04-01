<template>
  <div>
    <lobby
      v-if="state.state === 'lobby'"
      :state="state"
      @start="socket.emit('start')"
    />
    <playing
      v-else-if="state.state === 'playing'"
      :state="state"
      @word="(word) => socket.emit('word', word)"
    />
    <results v-else-if="state.state === 'results'" :state="state" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Socket } from "socket.io-client";
import API, { Socket as SocketType } from "@/api";
import { RoomState, DBG } from "@sift/shared";

import Playing from "./states/Playing.vue";
import Lobby from "./states/Lobby.vue";
import Results from "./states/Results.vue";

@Options({
  components: {
    Playing,
    Lobby,
    Results,
  },
  data() {
    return {
      state: {
        state: "lobby",
        leaderboard: [],
      },
    };
  },
  props: {
    socket: Socket,
    api: API,
  },
})
export default class Game extends Vue {
  socket!: SocketType;
  api!: API;
  state!: RoomState;

  async mounted() {
    this.socket.on("join", (name) => {
      if (this.state.state === "lobby") {
        this.state.leaderboard.push({
          name,
          score: 0,
        });
      }
    });
    this.socket.on("state_change", (state) => (this.state = state));

    this.socket.on(
      "connect",
      async () => (this.state = await this.api.roomState())
    );

    this.socket.on("connect", () => console.log("Connected."));
  }
}
</script>

<style></style>
