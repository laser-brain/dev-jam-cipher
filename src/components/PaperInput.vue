<template>
  <div class="paper">
    <textarea disabled type="text" v-model="text" ref="textarea" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    reqired: true
  }
})

const textarea: Ref<Element | null> = ref(null);
watch(() => props.text, (old, newV) => {
  if (textarea.value) {
    textarea.value.scrollTop = textarea.value.scrollHeight
  }
})
</script>

<style scoped lang="scss">

textarea {
  width: calc(100% - 2em);
  height: calc(100% - 2em);
  text-align: start;
  resize: none;
  border: none;
  margin: 1em;
  background: transparent;
  overflow: hidden;
}
</style>