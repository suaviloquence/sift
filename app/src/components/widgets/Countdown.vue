<template>
  <h2>{{ time }}</h2>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  emits: ["done"],
  props: {
    until: Number,
  },
  data() {
    return { time: 0, handle: undefined };
  },
})
export default class Countdown extends Vue {
  until!: number;
  time!: number;
  handle!: number | undefined;

  mounted() {
    const UPDATE = 1000; // every 1000 ms
    const update = () => {
      this.time = Math.round((this.until - Date.now()) / UPDATE);
      if (Date.now() >= this.until) {
        if (this.handle) clearInterval(this.handle);
        this.$emit("done");
      }
    };

    update();

    setTimeout(() => {
      update();
      this.handle = setInterval(update, UPDATE);
    }, (this.until - Date.now()) % UPDATE);
  }
}
</script>

<style></style>
