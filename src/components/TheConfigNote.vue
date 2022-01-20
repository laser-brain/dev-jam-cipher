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
    <div class="min-1em">
      <font-awesome-icon
        icon="feather-alt"
        v-show="!automaticConversion"
        @click="emit('convert')"
      />
    </div>
    
      <font-awesome-icon
        icon="volume-up"
         v-show="playAudio"
         @click="changePlayAudio(false)"
      />
      <font-awesome-icon
        icon="volume-mute"
         v-show="!playAudio"
         @click="changePlayAudio(true)"
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vigenere from "../services/vigenere";

library.add(faFeatherAlt, faVolumeUp, faVolumeMute);

const emit = defineEmits([
  "keyUpdated",
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

const playAudio = ref(localStorage.getItem('playAudio') === 'true');
  emit("playAudioChanged");
const changePlayAudio = (value: boolean) => {
  if (playAudio.value === value) {
    return;
  }
  
  playAudio.value = value;
  localStorage.setItem('playAudio', value ? 'true': 'false');
  emit("playAudioChanged");
}
const automaticConversion = ref(localStorage.getItem('automaticConversion') === 'true');
const changeAutomaticConversion = (value: boolean) => {
  if (automaticConversion.value === value) {
    return;
  }
  automaticConversion.value = value;
  localStorage.setItem('automaticConversion', value ? 'true': 'false');
  emit("automaticConversionChanged");
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
}
</style>