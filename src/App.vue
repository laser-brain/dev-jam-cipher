<script setup lang="ts">
import { ref, watch } from 'vue';
import vigenere from './services/vigenere';
import TheKeyboard from './components/TheKeyboard.vue';
import PaperInput from './components/PaperInput.vue';
import TheConfigBar from './components/TheConfigBar.vue';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheck)
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
      <div class="paper settings">
        <label>cipher key:</label>
        <input type="text" value="test" />
        <label>automatic conversion:</label>
        <font-awesome-icon icon="check" />
      </div>
    </div>
    <div class="sheet">
      <paper-input :text="input" />
    </div>
    <div class="sheet">
      <paper-input :text="encoded" />
    </div>
  </div>
  <the-keyboard @key-input="e => parseInput(e.key)" />
</template>

<style lang="scss">
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
  justify-content: space-between;
}

.settings {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  align-items: baseline;
  padding: 25px;

  label,
  input {
    font-size: 2em;
    font-family: "Oooh Baby", cursive;
  }

  input {
    border: none;
    max-width: 50%;
    background: transparent;
    border-bottom: 1px dashed black;
  }
}

.sheet {
  width: 25vw;
  height: calc(100vh - (45px * 5) - 7em - 40px);
  padding: 10px;
}

.paper {
  width: 100%;
  height: 100%;
  background-image: url("/src/assets/simple-old-paper-3-8.jpg");
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: url("/src/assets/stained-wooden-texture-table.jpg");
}
</style>
