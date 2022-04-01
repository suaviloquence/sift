<template>
  <div>
    <form @submit.prevent="connect">
      <div>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          autofocus
          autocomplete="off"
        />
        <label for="name">Name</label>
      </div>
      <div>
        <input
          id="room"
          v-model="room"
          type="text"
          required
          autocomplete="off"
        />
        <label for="room">Room Code</label>
      </div>
      <div>
        <input type="submit" value="Connect" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import API from "@/api";

@Options({
  data() {
    return {
      name: "",
      room: "",
    };
  },
  emits: ["connected"],
})
export default class Connect extends Vue {
  name!: string;
  room!: string;

  async connect() {
    const api = await API.connect(this.name, this.room);

    this.$emit("connected", api);
  }
}
</script>
