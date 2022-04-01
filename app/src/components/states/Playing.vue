<template>
  <div>
    <countdown :until="state.end" />
    <ul>
      <li v-for="(i, j) in word" :key="i">
        <button @click="removeLetter(j)">{{ letters[i][0] }}</button>
      </li>
    </ul>
    <ul>
      <span v-for="(letter, i) in letters" :key="i">
        <li v-if="available[i]">
          <button @click="appendLetter(i)">{{ letter }}</button>
        </li>
      </span>
    </ul>
    <div>
      <button @click="clear">Clear</button>
      <button @click="submit">Submit</button>
    </div>
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

<style></style>
