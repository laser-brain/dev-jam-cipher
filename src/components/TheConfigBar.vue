<template>
  <div class="flex">
    <input class="overrideKeyboard" type="text" v-model="encodingKey" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import vigenere from '../services/vigenere';

const emit = defineEmits(['keyUpdated'])

const encodingKey = ref(vigenere._key)
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
  emit('keyUpdated');
})
</script>

<style scoped lang="scss">
div {
  height: 60px;
  margin: 10px;
  background-color: lightcoral;
}
</style>