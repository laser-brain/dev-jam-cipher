<script setup lang="ts">
import { ref, watch } from 'vue';
import vigenere from './services/vigenere';
import TheKeyboard from './components/TheKeyboard.vue';
import PaperInput from './components/PaperInput.vue';
import TheConfigBar from './components/TheConfigBar.vue';

const input = ref('');
const encoded = ref('');
watch(input, (newValue, _) => {
  encoded.value = vigenere.encode(newValue);
  console.log(vigenere._key)
})

const ignoredChars = ["\r", ",", ".", "/"];

const parseInput = (text: string) => {
  if (text === "BACKSPACE") {
    input.value = input.value.slice(0, -1);
  } else {
    input.value += text
  }
}

const reevaluate = () => {
  encoded.value = vigenere.encode(input.value);
}
</script>

<template>
  <the-config-bar @keyUpdated="reevaluate" />
  <div class="flex">
    <div class="sheet">
      <paper-input :text="input" />
    </div>
    <div class="sheet">
      <paper-input :text="encoded" />
    </div>
  </div>
  <the-keyboard @key-input="e => parseInput(e.key)" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
body,
#app {
  height: 100vh;
}

.flex {
  display: flex;
  justify-content: center;
}
.sheet {
  width: 25vw;
  height: calc(100vh - (45px * 5) - 7em - 40px);
  padding: 10px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: url("/src/assets/stained-wooden-texture-table.jpg");
}
</style>
