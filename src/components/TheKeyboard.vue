<template>
  <div ref="keyboardBox" class="keyboard" @mouseover="initDrag">
    <div class="row" v-for="row, index in rows" :key="index">
      <div
        class="key"
        v-for="letter in row"
        :key="letter"
        :id="letter"
        :ref="el => { keyRefs[refIndex++] = getElement(el) }"
        @click="clickKey"
        @mousedown="startClickKey"
      >
        <span v-if="letter !== 'BACKSPACE'" class="letter">{{ letter }}</span>
        <img v-else width="42" src="/src/assets/backspace-arrow.svg" />
      </div>
    </div>
    <div
      id="space"
      @click="clickKey"
      @mousedown="startClickKey"
      :ref="el => { keyRefs[refIndex++] = getElement(el) }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, Ref } from "@vue/runtime-core";
import { ref } from "vue";
let refIndex = 0;
const keyboardScale = ref(0.7)
const rows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "BACKSPACE",],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", "."]
]
const typeSound = new Audio('/src/assets/audio/type.wav')

const keyboardBox: Ref<Element | null> = ref(null);

const initDrag = () => {
  if (keyboardBox.value) {
    keyboardBox.value.classList.add
  }
}

onMounted(() => {
  window.addEventListener('keydown', inputStart)
  window.addEventListener('keyup', inputEnd)
});

onUnmounted(() => {
  window.removeEventListener('keydown', inputStart)
  window.removeEventListener('keyup', inputEnd)
});

const getElement = (el: any) => {
  return el as Element;
}

const validInputKeyPressed = (pressedKey: string) => {
  return pressedKey === " " || rows.filter(row => {
    return row.indexOf(pressedKey) !== -1
  }).length > 0
}

const startClickKey = (e: MouseEvent) => {
  if (e.target instanceof Element) {
    let target = e.target;
    if (!target.id) {
      target = target.parentElement as Element;
    }

    target.classList.add('pressed');
  }
}
const clickKey = (e: MouseEvent) => {
  if (e.target instanceof Element) {
    let target = e.target;
    if (!target.id) {
      target = target.parentElement as Element;
    }
    target.classList.remove('pressed');
    if (validInputKeyPressed(target.id)) {
      const keyValue = target.id === "ENTER" ? "\r" : target.id
      emit('key-input', { key: keyValue });
    }
  }
}

const inputStart = (e: KeyboardEvent) => {
  if (e.target instanceof Element) {
    if (e.target.classList.contains('overrideKeyboard')) {
      return;
    }
  }

  let pressedKey = e.key.toUpperCase();
  if (validInputKeyPressed(pressedKey)) {
    const elementId = pressedKey === " " ? "space" : pressedKey
    const element = keyRefs.value.filter(el => el?.id === elementId)[0];
    element?.classList.add('pressed')
    typeSound.pause();
    typeSound.currentTime = 0;
    typeSound.play();
  }
}
const inputEnd = (e: KeyboardEvent) => {
  if (e.target instanceof Element) {
    if (e.target.classList.contains('overrideKeyboard')) {
      return;
    }
  }
  let pressedKey = e.key.toUpperCase();
  if (validInputKeyPressed(pressedKey)) {
    const elementId = pressedKey === " " ? "space" : pressedKey
    const element = keyRefs.value.filter(el => el?.id === elementId)[0];
    element?.classList.remove('pressed')
    const keyValue = pressedKey === "ENTER" ? "\r" : pressedKey

    emit('key-input', { key: keyValue });
  }
}
const keyRefs: Ref<(Element | null)[]> = ref([]);

const emit = defineEmits(['key-input'])
</script>

<style scoped lang="scss">
.keyboard {
  position: absolute;
  padding-top: 20px;
  padding: 50px;
  bottom: 5px;
  left: calc(50vw - 500px);
  width: 1000px;
  background-color: #1a1f33;
  display: flex;
  flex-wrap: wrap;
  border-radius: 120px 120px 150px 150px;
  box-shadow: inset -1px -5px 66px 44px rgba(0, 0, 0, 1),
    -10px -10px 14px -4px #1a1f33;
  justify-content: center;
  transform: scale(0.7);

  @media screen and (orientation: portrait) {
    transform: scale(0.37);
    left: -345px;
  }

  .row {
    display: flex;
    height: 80px;
    justify-content: space-around;
  }
}

.key {
  box-sizing: border-box;
  border: 5px solid #fafdfe;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding-top: 0.5em;
  font-size: 1.5em;
  background-color: black;
  color: gray;
  box-shadow: inset -10px -10px 10px -10px rgba(0, 0, 0, 0.58),
    inset 20px 20px 20px -20px rgba(255, 255, 255, 1),
    0px 0px 18px 12px rgba(0, 0, 0, 1);
  margin: 10px;

  &:hover {
    cursor: pointer;
  }
}

.key,
#space,
#ENTER {
  &.pressed {
    background-color: lightblue;
    transform: scale(0.85);
    transition: all 0.1s;
  }
}

.letter {
  font-size: 1.25em;
}

#space {
  display: flex;
  height: 80px;
  justify-content: space-around;
  background-color: black;
  border-radius: 20px;
  width: 60%;
  height: 60px;
  margin: 20px 0 20px 0;
  box-shadow: inset -10px -10px 10px -10px rgba(0, 0, 0, 0.58),
    inset 20px 20px 20px -20px rgba(255, 255, 255, 1),
    0px 0px 18px 12px rgba(0, 0, 0, 1);
  border: 5px solid #fafdfe;
}

#ENTER {
  display: flex;
  justify-content: center;
  background-color: black;
  border-radius: 20px;
  width: 120px;
  height: 60px;
  box-shadow: -1px -10px 12px -4px rgba(0, 0, 0, 0.5),
    -19px -5px 12px -4px rgba(0, 0, 0, 1),
    inset -5px -5px 6px 1px rgba(255, 255, 255, 0.3),
    10px 10px 26px -3px rgba(0, 0, 0, 0.87);
}

img.letter {
  background-color: gray;
}
</style>
