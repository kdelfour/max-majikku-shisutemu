<template>
  <section v-motion-slide-visible-once-top>
    <form @submit.prevent="handleAskMagi">
      <h4 for="question">Ask your question:</h4>
      <textarea
        id="question"
        type="text"
        style="width: 100%"
        v-model="question"
        placeholder="Your question..."
        required
        @keydown.enter.prevent="() => {}"
      />
      <div style="display: flex; justify-content: end">
        <button class="cyberpunk red" @click="handleClear">Clear</button>
        <button class="cyberpunk blue" type="submit">Submit</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const question = ref('');
const emits = defineEmits(['askMagi', 'clear']);

const handleAskMagi = async () => {
  emits('askMagi', question.value);
};

const handleClear = () => {
  emits('clear');
};

</script>
