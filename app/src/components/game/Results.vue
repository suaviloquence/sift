<template>
  <div>
    <ol>
      <li v-for="(player, i) in state.players" :key="i">
        <h2>{{ player.name }}</h2>
        <ul>
          <li
            v-for="({ word, valid }, j) in player.words"
            :key="j"
            :style="{ visibility: j < revealed ? 'visible' : 'hidden' }"
          >
            <span :class="{ valid, word: true }">{{ word }}</span>
            <span v-if="valid">&nbsp;(+{{ pointValue(word) }})</span>
          </li>
        </ul>
      </li>
    </ol>
    <!-- once timer completes but socket hasn't emitted (prettier) -->
    <countdown :until="state.next" v-if="done" @done="done = false" />
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
      done: false,
      revealed: 0,
    };
  },
})
export default class Results extends Vue {
  state!: ResultsState;
  done!: boolean;
  revealed!: number;

  pointValue = pointValue;

  mounted() {
    let max = 0;
    for (const player of this.state.players) {
      max = Math.max(max, player.words.length);
    }

    const handle = setInterval(() => {
      this.revealed++;
      if (this.revealed > max) {
        clearInterval(handle);
        this.done = true;
      }
    }, 1000);
  }
}
</script>

<style scoped>
ol {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

ol > li {
  flex-basis: 21%;
  padding: 3%;
  margin: 3%;
  background-color: var(--alternate);
  border-radius: 5%;
}

ol > li h2 {
  font-size: 2rem;
  text-align: center;
}

.word {
  font-size: 1.25rem;
}

.word:not(.valid) {
  color: #ff7477;
  text-decoration: #ff7477 line-through;
}

.word.valid {
  color: #adf7b6;
}
</style>
