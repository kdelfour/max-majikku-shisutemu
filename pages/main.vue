<template>
  <div ref="contentContainer">
    <section v-motion-slide-visible-once-top class="cyberpunk black both">
      <h1>マジックシステム <em>(Majikku Shisutemu)</em></h1>
      <!-- <Loader /> -->
    </section>
    <section v-motion-slide-visible-once-top>
      <form @submit.prevent="askMagi">
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
          <button class="cyberpunk red" @click="clear">Clear</button>
          <button class="cyberpunk blue" type="submit">Submit</button>
        </div>
      </form>
    </section>

    <Responses
      v-motion-slide-visible-once-top
      v-if="question && requestSended"
      :loadingResponses="loading"
      :requestSended="send"
      :question="question"
      :responses="responses"
    />

    <Deliberation
      v-motion-slide-visible-once-top
      v-if="completedResponses === 3"
      :deliberation="deliberation"
    />
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import markdownit from "markdown-it";
import axios from "axios";

const question = ref("");
const responses = ref({ Melchior: "", Balthasar: "", Casper: "" });
const loading = ref(false);
const requestSended = ref(false);
const deliberation = ref(null);
const completedResponses = ref(0);
const contentContainer = ref(null);

let melchiorEventSource, balthasarEventSource, casperEventSource;

const clear = () => {
  question.value = "";
  send.value = false;
  loading.value = false;
  deliberation.value = null;
  completedResponses.value = 0;
  responses.value = { Melchior: "", Balthasar: "", Casper: "" };
};

const askMagi = async () => {
  requestSended.value = true;
  loading.value = true;
  deliberation.value = null;
  responses.value = { Melchior: "", Balthasar: "", Casper: "" };

  // Ajout de la question dans les données envoyées
  const responsePayload = {
    Melchior: responses.value.Melchior,
    Balthasar: responses.value.Balthasar,
    Casper: responses.value.Casper,
    question: question.value, // Transmission de la question
  };

  // Création des sources d'événements pour Melchior et Balthasar
  melchiorEventSource = new EventSource(
    `/api/melchior?question=${encodeURIComponent(question.value)}`
  );
  balthasarEventSource = new EventSource(
    `/api/balthasar?question=${encodeURIComponent(question.value)}`
  );
  casperEventSource = new EventSource(
    `/api/casper?question=${encodeURIComponent(question.value)}`
  );

  // Modification des gestionnaires d'événements pour incrémenter le compteur une fois le stream terminé
  melchiorEventSource.onmessage = function (event) {
    if (melchiorEventSource.readyState !== EventSource.CLOSED) {
      const data = JSON.parse(event.data);
      if (data.message) {
        responses.value.Melchior += data.message;
      }
      if (data.end) {
        completedResponses.value++;
        melchiorEventSource.close();
        checkAllResponsesCompleted();
      }
    }
  };

  balthasarEventSource.onmessage = function (event) {
    if (balthasarEventSource.readyState !== EventSource.CLOSED) {
      const data = JSON.parse(event.data);
      if (data.message) {
        responses.value.Balthasar += data.message;
      }
      if (data.end) {
        completedResponses.value++;
        balthasarEventSource.close();
        checkAllResponsesCompleted();
      }
    }
  };

  casperEventSource.onmessage = function (event) {
    if (casperEventSource.readyState !== EventSource.CLOSED) {
      const data = JSON.parse(event.data);
      if (data.message) {
        responses.value.Casper += data.message;
      }
      if (data.end) {
        completedResponses.value++;
        casperEventSource.close();
        checkAllResponsesCompleted();
      }
    }
  };

  // Fonction pour vérifier si tous les streams sont terminés
  function checkAllResponsesCompleted() {
    if (completedResponses.value === 3) {
      loading.value = false;
      // Si les trois réponses sont complètes
      finalizeDeliberation();
    }
  }

  async function finalizeDeliberation() {
    const deliberationResult = await axios.post(
      "/api/evaluator",
      responsePayload
    );
    deliberation.value = deliberationResult.data;
    loading.value = false;
    contentContainer.value.scrollToEnd();
    contentContainer.value = null;
  }
};

onUnmounted(() => {
  if (melchiorEventSource) melchiorEventSource.close();
  if (balthasarEventSource) balthasarEventSource.close();
  if (casperEventSource) casperEventSource.close();
});

onUpdated(() => {
  if (contentContainer.value) {
    contentContainer.value.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});
</script>

<style scoped></style>
