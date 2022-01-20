<template>
  <div class="paper">
    <div class="ff-info" v-show="enablePasteFF">
      Firefox does not allow pasting directly from the clipboard. Please paste
      or type into the textarea and send with Enter!
    </div>
    <textarea
      :disabled="!enablePasteFF"
      :class="enablePasteFF ? 'overrideKeyboard' : ''"
      v-model="textRef"
      ref="textarea"
      @keyup="processPastedText"
    />
    <font-awesome-icon
      icon="copy"
      v-if="enableCopy"
      title="Copy to clipboard"
      @click="copy"
    />
    <font-awesome-icon
      icon="paste"
      v-if="enablePaste"
      title="Paste from clipboard"
      @click="paste"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCopy, faPaste } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vigenere from "../services/vigenere";

library.add(faCopy, faPaste);

const props = defineProps({
  text: {
    type: String,
    reqired: true,
  },
  enableCopy: {
    type: Boolean,
    reqired: false,
  },
  enablePaste: {
    type: Boolean,
    reqired: false,
  },
});

const textRef = ref(props.text);

const emit = defineEmits(["paste"]);

const copy = () => {
  if (props.text) {
    navigator.clipboard.writeText(props.text);
  }
};

const enablePasteFF = ref(false);

const paste = () => {
  if (navigator.clipboard.readText) {
    navigator.clipboard.readText().then((data) => {
      textRef.value = sanitize(data);
      emit("paste", data);
    });
  } else {
    enablePasteFF.value = true;
    setTimeout(() => {
      textarea.value?.focus(), 250;
    });
  }
};

const sanitize = (data: string) => {
  if (/^[A-Za-z0-9]*$/g.test(data)) {
    return data;
  }
  let result: string = "";
  for (let letter of data) {
    if (
      vigenere._ignoreKeys.indexOf(letter) !== -1 ||
      /^[A-Za-z]*$/g.test(letter)
    ) {
      result += letter;
    }
  }
  return result;
};

const processPastedText = (e: KeyboardEvent) => {
  if (e.key == "Enter") {
    textRef.value = sanitize(textRef.value?.slice(0, -1) || "");
    emit("paste", textRef.value);
    enablePasteFF.value = false;
  }
};

const textarea: Ref<HTMLElement | null> = ref(null);
watch(
  () => props.text,
  () => {
    if (textarea.value) {
      textarea.value.scrollTop = textarea.value.scrollHeight;
    }
  }
);
</script>

<style scoped lang="scss">
.paper {
  position: relative;
}

textarea {
  width: calc(100% - 2em);
  height: calc(100% - 2em);
  text-align: start;
  resize: none;
  border: none;
  margin: 1em;
  overflow: hidden;

  &:disabled {
    background: transparent;
  }
}

.svg-inline--fa {
  position: absolute;
  top: 5;
  right: 5;
  cursor: pointer;
  font-size: 1.5rem;
  &:active {
    transform: scale(0.8);
  }
  &:hover {
    color: beige;
  }
}

.ff-info {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>