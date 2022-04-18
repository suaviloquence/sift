<template>
  <game v-if="socket != null" :socket="socket" :api="api" @finale="finale" />
  <finale
    v-else-if="leaderboard != null"
    :leaderboard="leaderboard"
    @back="leaderboard = null"
  />
  <connect v-else @connected="connect" />
</template>

<script lang="ts">
import { Leaderboard } from "@sift/shared";
import { Options, Vue } from "vue-class-component";

import API, { Socket } from "./api";
import Connect from "./components/Connect.vue";
import Game from "./components/game/Game.vue";
import Finale from "./components/Finale.vue";

@Options({
  components: {
    Connect,
    Game,
    Finale,
  },
  data() {
    return {
      socket: null,
      api: null,
      leaderboard: null,
    };
  },
})
export default class App extends Vue {
  socket!: Socket | null;
  api!: API | null;
  leaderboard!: Leaderboard | null;

  connect(api: API) {
    this.api = api;
    this.socket = api.socket();
  }

  finale(leaderboard: Leaderboard) {
    console.dir(leaderboard);
    this.leaderboard = leaderboard;
    this.api = null;
    this.socket = null;
  }
}
</script>

<style></style>
