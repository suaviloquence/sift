<template>
  <div class="root">
    <div v-if="create === undefined" id="choose">
      <button @click="create = true">Create Room</button>
      <button @click="create = false">Join Room</button>
    </div>
    <form @submit.prevent="connect" v-else>
      <button @click="create = undefined">Back</button>
      <div v-if="error" id="error">{{ error }}</div>
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
      <div v-if="create">
        <div>
          <input id="rounds" v-model="rounds" type="number" min="1" required />
          <label for="rounds">Total Rounds</label>
        </div>
        <div>
          <input
            id="round_length"
            v-model="round_length"
            type="number"
            min="1"
            required
          />
          <label for="round_length">Round Length (seconds)</label>
        </div>
      </div>
      <div>
        <button type="submit">{{ create ? "Create" : "Join" }}</button>
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
      create: undefined,
      name: "",
      room: "",
      rounds: 3,
      round_length: 45,
      error: null,
    };
  },
  emits: ["connected"],
})
export default class Connect extends Vue {
  create!: boolean;
  name!: string;
  room!: string;
  rounds!: number;
  round_length!: number;
  error!: string | null;

  async connect() {
    let api;

    if (this.create) {
      try {
        api = await API.create(
          this.name,
          this.room,
          this.rounds,
          this.round_length
        );
      } catch {
        this.error = "Room already exists.";
        return;
      }
    } else {
      try {
        api = await API.join(this.name, this.room);
      } catch {
        this.error = "Room not found.";
        return;
      }
    }

    this.$emit("connected", api);
  }
}
</script>

<style scoped>
.root {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

input,
button {
  background-color: var(--alternate);
  border: none;
  border-radius: 2vmin;
  font-size: inherit;
  box-sizing: border-box;
  padding: 2vmin;
  margin: 1vmin;
  color: var(--alternate-text);
}

label {
  color: var(--alternate);
}

button {
  cursor: pointer;
}

:focus-visible,
button:hover {
  outline: none;
  background-color: var(--accent);
}

:focus-visible + label {
  color: var(--accent);
}
</style>
