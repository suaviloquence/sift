<template>
  <div>
    <ol>
      <li v-for="(player, i) in state.players" :key="i">
        <h2>{{ player.name }}</h2>
        <ul>
          <li v-for="({ word, valid }, j) in words[i]" :key="j">
            <span :class="valid ? 'ok' : 'no'">{{ word }}</span>
            <span v-if="valid">&nbsp;(+{{ pointValue(word) }})</span>
          </li>
        </ul>
      </li>
    </ol>
    <!-- @done="done--": hide once timer completes but socket hasn't emitted (prettier) -->
    <countdown :until="state.next" v-if="done == 0" @done="done--" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { DBG, Results as ResultsState, pointValue, Word } from "@sift/shared";

import Countdown from "@/components/widgets/Countdown.vue";

@Options({
  components: {
    Countdown,
  },
  props: {
    state: Object,
  },
  data() {
    return {
      words: [],
      done: -1,
    };
  },
})
export default class Results extends Vue {
  state!: ResultsState;
  words!: Word[][];
  done!: number;

  pointValue = pointValue;

  mounted() {
    this.done = this.state.players.length;
    for (const i in this.state.players) {
      this.words.push([]);
      const { words } = this.state.players[i];

      let j = words.length;

      const handle = setInterval(() => {
        if (j == 0) {
          clearInterval(handle);
          this.done--;
          return;
        }
        this.words[i].push(words.shift() as Word);
        j--;
      }, 500);
    }
  }
}
</script>

<style scoped>
.no {
  color: red;
  text-decoration: red line-through;
}

.ok {
  color: green;
}
</style>
