<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Hellos: {{ hellos }}</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";

@Options({
  data() {
    return {
      msg: "Loading...",
      hellos: -1,
    };
  },
})
export default class HelloWorld extends Vue {
  msg!: string;
  hellos!: number;

  async created() {
    const { hellos, msg } = (await axios.get("/api/hello")).data;
    this.msg = msg;
    this.hellos = hellos;
  }
}
</script>

<style></style>
