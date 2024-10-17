<template>
  <div class="width3">
    <h1>{{ title }}</h1>
    <div class="response-section" v-if="response">
      <h3>{{ subtitle }}</h3>
      <div v-html="markdownit().render(response)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import markdownit from "markdown-it";

defineProps({
  title: String,
  subtitle: String,
  response: String,
});
</script>
