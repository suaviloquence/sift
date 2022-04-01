<template>
  <div>
    <ol>
      <li v-for="player in state.leaderboard" :key="player.name">
        <strong>{{ player.name }}</strong
        >: {{ player.score }}
      </li>
    </ol>
    <button
      :disabled="state.leaderboard.length < MIN_ROOM_SIZE"
      @click="$emit('start')"
    >
      Start
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { DBG, Lobby as LobbyState, MIN_ROOM_SIZE } from "@sift/shared";

@Options({
  emits: ["start"],
  props: {
    state: Object,
  },
})
export default class Lobby extends Vue {
  state!: LobbyState;
  MIN_ROOM_SIZE = MIN_ROOM_SIZE;
}
</script>

<style></style>
