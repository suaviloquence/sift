<template>
  <div class="root">
    <div id="controls">
      <button @click="clear">CLEAR</button>
      <countdown id="countdown" :until="state.end" />
      <button @click="submit">SUBMIT</button>
    </div>
    <ul id="word">
      <li v-for="(i, j) in word" :key="i">
        <button @click="removeLetter(j)">{{ letters[i][0] }}</button>
      </li>
    </ul>
    <ul id="letters">
      <li v-for="(letter, i) in letters" :key="i">
        <button @click="appendLetter(i)" :disabled="!available[i]">
          {{ letter }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { DBG, Playing as PlayingState } from "@sift/shared";

import Countdown from "@/components/widgets/Countdown.vue";

@Options({
  components: {
    Countdown,
  },
  emits: ["word"],
  props: {
    state: Object,
  },
  data() {
    return {
      word: [],
      letters: [],
      available: [],
    };
  },
})
export default class Playing extends Vue {
  state!: PlayingState;
  word!: number[];
  letters!: string[];
  available!: boolean[];

  mounted() {
    this.letters = [...this.state.letters];
    this.available = this.letters.map(() => true);
  }

  insertLetter(i: number, j: number) {
    this.word.splice(j, 0, i);
    this.available[i] = false;
  }

  appendLetter(i: number) {
    this.word.push(i);
    this.available[i] = false;
  }

  removeLetter(j: number) {
    let [i] = this.word.splice(j, 1);

    this.available[i] = true;
  }

  clear() {
    this.word.length = 0;
    for (let i = 0; i < this.letters.length; i++) {
      this.available[i] = true;
    }
  }

  submit() {
    const word = this.word.map((i) => this.letters[i][0]).join("");
    this.$emit("word", word);
    this.clear();
  }
}
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
}

.root > * {
  display: flex;
  flex-direction: row;
}

ul {
  /* disable bullets */
  list-style: none;
  padding-inline-start: 0;
}

#controls {
  flex-basis: 15%;
  justify-content: space-evenly;
  align-content: end;
  column-gap: 5%;
}

#controls > * {
  flex-basis: 20%;
}

#controls button {
  background-color: var(--alternate);
  color: var(--alternate-text);
}

#countdown {
  text-align: center;
  align-self: center;
}

#word {
  flex-basis: 20%;
  justify-content: left;
  column-gap: 0.5%;
}

#word li {
  flex-basis: 10%;
}

#word button {
  font-size: 10vmin;
}

#letters {
  box-sizing: border-box;
  flex-basis: 50%;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 5%;
}

#letters li {
  flex-basis: 28%;
}

#letters button {
  font-size: 10vmin;
  /* font-size: 100%; */
  vertical-align: middle;
}

#letters button:disabled {
  visibility: hidden;
}

button {
  text-align: center;
  background-color: var(--accent);
  color: var(--accent-text);
  padding: 0;
  width: 100%;
  height: 100%;
  /* font-family: "Noto Sans Mono", monospace; */
  border-radius: 15%;
  border: none;
}
</style>
