<template>
  <game v-if="socket != null" :socket="socket" :api="api" />
  <connect v-else @connected="connect" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import API, { Socket } from "./api";
import Connect from "./components/Connect.vue";
import Game from "./components/Game.vue";

@Options({
  components: {
    Connect,
    Game,
  },
  data() {
    return {
      socket: null,
      api: null,
    };
  },
})
export default class App extends Vue {
  socket!: Socket | null;
  api!: API | null;

  connect(api: API) {
    this.api = api;
    this.socket = api.socket();
  }
}
</script>

<style></style>
