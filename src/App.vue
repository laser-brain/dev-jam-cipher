<script setup lang="ts">
import { ref, watch } from "vue";
import vigenere from "./services/vigenere";
import TheKeyboard from "./components/TheKeyboard.vue";
import PaperInput from "./components/PaperInput.vue";
import TheConfigNote from "./components/TheConfigNote.vue";

const input = ref("");
const output = ref("");
const autoUpdateOutput = ref(
  localStorage.getItem("automaticConversion") === "true"
);
const playAudio = ref(localStorage.getItem("playAudio") === "true");
const mode = ref(localStorage.getItem("mode") || "encode");

watch(input, () => {
  if (autoUpdateOutput.value) {
    updateOutput();
  }
});

const generateOutput = (input: string) => {};

const parseInput = (text: string) => {
  if (text === "BACKSPACE") {
    input.value = input.value.slice(0, -1);
  } else {
    input.value += text;
  }
};

const reevaluate = () => {
  localStorage.setItem("cipherKey", vigenere._key);
  updateOutput();
};

const toggleAutoUpdateOutput = () => {
  autoUpdateOutput.value = !autoUpdateOutput.value;

  if (!autoUpdateOutput.value) {
    output.value = "";
  } else {
    updateOutput();
  }
};

const toggleMode = () => {
  mode.value = mode.value === "encode" ? "decode" : "encode";  
  updateOutput();
};

const updateOutput = () => {
  if(!input.value){
    output.value = '';
    return;
  }
  let result = "";
  switch (mode.value) {
    case "encode":
      result = vigenere.encode(input.value);
      break;
    case "decode":
      result = vigenere.decode(input.value);
      break;
    default:
      break;
  }
  console.log(result);
  
  if (autoUpdateOutput.value) {
    output.value = result;
  } else {
    const partialResult = result.substring(output.value.length);
    let i = 0;
    const write = window.setInterval(() => {
      output.value += partialResult[i++];
      if (i === partialResult.length) {
        clearInterval(write);
      }
    }, 200);
  }
};

const togglePlayAudio = () => {
  playAudio.value = !playAudio.value;
};

window.addEventListener("keydown", function (e) {
  if (e.key == "space" && e.target == document.body) {
    e.preventDefault();
  }
});
</script>

<template>
  <div class="flex offset-top">
    <div class="sheet handwriting">
      <the-config-note
        @keyUpdated="reevaluate"
        @automatic-conversion-changed="toggleAutoUpdateOutput"
        @play-audio-changed="togglePlayAudio"
        @mode-changed="toggleMode"
        @convert="updateOutput()"
      />
    </div>
    <div class="sheet typed">
      <paper-input :text="input" />
    </div>
    <div class="sheet handwriting">
      <paper-input :text="output" />
    </div>
  </div>

  <div class="paper sheet handwriting info">
    <p>
      Start typing on your keyboard or click the typewriter's keys to input text
    </p>
    <p>To enable encoding, a cipher key has to be set!</p>
    <p>
      If automatic conversion is disabled, click on the feather icon to encode
      the input text.
    </p>
  </div>
  <the-keyboard
    @key-input="(e) => parseInput(e.key)"
    :play-audio="playAudio"
    :key="`keyboard_${playAudio}`"
  />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.offset-top {
  padding-top: 7em;
}

body,
#app {
  height: 100vh;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.sheet {
  width: 25vw;
  height: calc(100vh - (45px * 5) - 7em - 40px);
  padding: 10px;
}

.paper {
  height: 100%;
  padding: 32px;
  background-image: url("/src/assets/simple-old-paper-3-8.jpg");
}

.handwriting {
  * {
    font-size: 1.5rem;
    font-family: "Oooh Baby", cursive;
  }
}

.typed {
  * {
    font-family: "Special Elite", cursive;
    font-size: 1rem;
    text-transform: uppercase;
  }
}

.info {
  max-height: 8em;
  max-width: 24em;
  padding: 2em;
  margin: 1em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: url("/src/assets/stained-wooden-texture-table.jpg");
}
</style>
