<template>
<section class="cyberpunk black both">
      <div class="boxtree">
        <div class="children2 width1">
          <h1 v-if="loadingResponses">Loading...</h1>
          <h1 v-else>Responses</h1>
        </div>
        
        <Response
          title="Melchior"
          subtitle="Analyse Scientifique/Rationnel"
          :response="responses?.Melchior"
        />

        <Response
          title="Balthasar"
          subtitle="Analyse Éthique/Émotionnel"
          :response="responses?.Balthasar"
        />

        <Response
          title="Casper"
          subtitle="Analyse Pragmatique/Pratique"
          :response="responses?.Casper"
        />
      </div>
    </section>
</template>

<script setup lang="ts">
defineProps({
  loadingResponses: Boolean,
  responses: Object,
});
</script>

<style scoped lang="scss">
@media (max-width: 768px) {
  .width3 {
    width: 80%;
  }
}
</style>