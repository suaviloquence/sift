<template>
  <div id="top">
    {{ api.name }}
    <span id="room">ROOM: {{ api.room }}</span>
  </div>
  <lobby
    id="main"
    v-if="state.state === 'lobby'"
    :state="state"
    @start="socket.emit('start')"
  />
  <playing
    id="main"
    v-else-if="state.state === 'playing'"
    :state="state"
    @word="(word) => socket.emit('word', word)"
  />
  <results v-else-if="state.state === 'results'" :state="state" id="main" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Socket } from "socket.io-client";
import API, { Socket as SocketType } from "@/api";
import { RoomState, DBG } from "@sift/shared";

import Playing from "./Playing.vue";
import Lobby from "./Lobby.vue";
import Results from "./Results.vue";

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
  emits: ["finale"],
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

    this.socket.on("finale", (leaderboard) =>
      this.$emit("finale", leaderboard)
    );

    this.socket.on(
      "connect",
      async () => (this.state = await this.api.roomState())
    );
  }
}
</script>

<style>
#top {
  flex-basis: 10%;
  background-color: var(--alternate);
  color: var(--alternate-text);
  font-size: 2rem;
  width: 100%;
  text-align: center;
  justify-self: center;
}

#main {
  flex-basis: 90%;
  margin: 1%;
}
</style>
