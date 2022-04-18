<template>
  <div class="root">
    <ol>
      <li v-for="player in state.leaderboard" :key="player.name">
        <span class="name">{{ player.name }}</span
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

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 5%;
  height: 100%;
}

ol {
  flex-basis: 80%;
}

button {
  flex-basis: 10%;
  background-color: var(--alternate);
  border-radius: 5vw;
  border: none;
  font-size: 3rem;
  color: var(--alternate-text);
  cursor: pointer;
}

button:hover {
  background-color: var(--alternate-light);
}

.name {
  font-weight: bold;
}
</style>
