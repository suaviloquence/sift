<template>
  <h1>Results</h1>
  <ol>
    <li
      v-for="({ name, score }, i) in leaderboard"
      :style="{ visibility: i >= revealed ? 'visible' : 'hidden' }"
      :key="i"
    >
      <span class="name">{{ name }}:</span>
      &nbsp;{{ score }}
    </li>
  </ol>
  <button v-if="revealed == -1" @click="$emit('back')">Back</button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { Leaderboard } from "@sift/shared";

@Options({
  data() {
    return {
      revealed: -1,
    };
  },
  emits: ["back"],
  props: {
    leaderboard: Object,
  },
})
export default class Finale extends Vue {
  leaderboard!: Leaderboard;
  revealed!: number;

  created() {
    this.revealed = this.leaderboard.length;

    let tension = this.leaderboard.length == 1;
    const handle = setInterval(() => {
      if (this.revealed == 0) clearInterval(handle);
      if (this.revealed == 1 && !tension) {
        tension = true;
        return;
      }

      this.revealed--;
    }, 1000);
  }
}
</script>

<style scoped>
h1 {
  flex-basis: 10%;
  width: 100%;
  font-size: 3rem;
  background: var(--alternate);
  color: var(--alternate-text);
  box-sizing: border-box;
  padding: 1%;
  text-align: center;
}

ol {
  flex-basis: 70%;
  font-size: 1.5rem;
  list-style: decimal;
  color: var(--text);
}

button {
  flex-basis: 9%;
  min-width: 20%; /* min: sometimes the font is big */
  font-size: 2rem;
  box-sizing: border-box;
  margin-block-end: 1%;
  background: var(--alternate);
  color: var(--alternate-text);
  border: none;
  border-radius: 2vmin;
  cursor: pointer;
}

button:hover {
  background: var(--accent);
  color: var(--accent-text);
}
</style>
