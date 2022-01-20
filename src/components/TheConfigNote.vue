<template>
  <div class="paper settings offset-top">
    <label>Cipher key:</label>
    <input class="overrideKeyboard" type="text" v-model="encodingKey" />
    <label>Automatic conversion:</label>
    <div class="fill">
      <span
        :class="automaticConversion ? '' : 'unset'"
        @click="changeAutomaticConversion(true)"
        >Yes</span
      >
      /
      <span
        :class="automaticConversion ? 'unset' : ''"
        @click="changeAutomaticConversion(false)"
        >No</span
      >
    </div>
    <font-awesome-icon
      icon="volume-up"
      v-show="!playAudio"
      title="Enable typing sound"
      @click="changePlayAudio(true)"
    />
    <font-awesome-icon
      icon="volume-mute"
      v-show="playAudio"
      title="Disable typing sound"
      @click="changePlayAudio(false)"
    />
    <font-awesome-icon
      icon="eye-slash"
      title="Switch to decoding mode"
      v-show="mode === 'encode'"
      @click="changeMode('decode')"
    />
    <font-awesome-icon
      icon="eye"
      title="Switch to encoding mode"
      v-show="mode === 'decode'"
      @click="changeMode('encode')"
    />
    <font-awesome-icon
      icon="feather-alt"
      :title="mode === 'encode' ? 'encode' : 'decode'"
      :style="{ color: automaticConversion ? '#777' : 'black' }"
      :class="automaticConversion? 'disabled' : ''"
      @click="() => { if (!automaticConversion) { emit('convert'); } }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFeatherAlt,
  faVolumeUp,
  faVolumeMute,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vigenere from "../services/vigenere";

library.add(faFeatherAlt, faVolumeUp, faVolumeMute, faEye, faEyeSlash);

const emit = defineEmits([
  "keyUpdated",
  "modeChanged",
  "playAudioChanged",
  "automaticConversionChanged",
  "convert",
]);

const encodingKey = ref(vigenere._key);
watch(encodingKey, (newValue, oldValue) => {
  if (!/^[A-Za-z]*$/g.test(newValue)) {
    encodingKey.value = oldValue;
    return;
  }
  if (!/^[A-Z]*$/g.test(newValue)) {
    encodingKey.value = newValue.toUpperCase();
    return;
  }
  vigenere.setKey(newValue.toUpperCase());
  emit("keyUpdated");
});

const playAudio = ref(localStorage.getItem("playAudio") === "true");
const changePlayAudio = (value: boolean) => {
  if (playAudio.value === value) {
    return;
  }

  playAudio.value = value;
  localStorage.setItem("playAudio", value ? "true" : "false");
  emit("playAudioChanged");
};

const automaticConversion = ref(
  localStorage.getItem("automaticConversion") === "true"
);
const changeAutomaticConversion = (value: boolean) => {
  if (automaticConversion.value === value) {
    return;
  }
  automaticConversion.value = value;
  localStorage.setItem("automaticConversion", value ? "true" : "false");
  emit("automaticConversionChanged");
};

const mode = ref(localStorage.getItem("mode") || "encode");
const changeMode = (value: string) => {
  if (mode.value === value) {
    return;
  }

  mode.value = value;
  localStorage.setItem("mode", value);
  emit("modeChanged");
};
</script>

<style scoped lang="scss">
.settings {
  height: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 64px;
  margin-top: 128px;
  transform: rotate(-8deg);

  span {
    margin: 0 20px 0 20px;
    &:hover {
      cursor: pointer;
    }
    &.unset {
      text-decoration: line-through;
    }
  }
  input {
    border: none;
    max-width: 50%;
    background: transparent;
    border-bottom: 1px dashed black;
    text-align: center;
  }
}
.min-1em {
  min-width: 1em;
}
.svg-inline--fa {
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
  }
}
</style>