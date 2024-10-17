<template>
  <div>
    <section class="cyberpunk both" v-if="!deliberation">
        <h1>Deliberation en cours...</h1>
    </section>

    <section class="cyberpunk both" v-else>
      <h1>Deliberation</h1>
      <p>
        Response :
        {{ deliberation.response ? deliberation.response : deliberation }}
      </p>
      <p>Consensus : {{ deliberation.consensus ? "Oui" : "Non" }}</p>
      <p>
        Détail de la délibération :
        {{
          deliberation.deliberation ? deliberation.deliberation : deliberation
        }}
      </p>
      <p>
        Pourcentage de consensus :
        {{
          deliberation.percent_consensus
            ? deliberation.percent_consensus
            : "00"
        }}%
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps({
  deliberation: Object,
});
</script>
