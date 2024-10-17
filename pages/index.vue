<template>
  <section v-motion-slide-visible-once-top class="cyberpunk black both">
    <h1 style="color: var(--yellow-color)">
      マジックシステム <em>(Majikku Shisutemu)</em>
    </h1>
    <Loader v-if="!hideLoader" style="margin-top: 20vh; margin-bottom: 20vh" />
    {{ apiKey }}
    <div
      class="error"
      v-if="error"
      style="margin-top: 20vh; margin-bottom: 20vh; color: var(--red-color)"
    >
      <h3>Access denied</h3>
      <p>{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import axios from "axios";
const router = useRouter();
const hideLoader = ref(false);
const error = ref(null);

onMounted(() => {
  setTimeout(() => {
    checkApiKey();
  }, 3000);
});

async function checkApiKey() {
  try {
    const response = await axios.get(`/api/check`);
    if (response.data.valid) {
      router.push("/main");
    } else {
      throw new Error("Invalid API key");
    }
  } catch (err) {
    error.value = `The API key is missing or invalid. 
    Please ensure that the OPENAI_API_KEY key is correctly configured in the .env file or in the environment variables of your system to access AI.`;
    hideLoader.value = true;
  }
}
</script>

<style scoped>
.error {
  color: var(--red-color);
  h3:before {
    background-color: var(--red-color);
  }
  h3 {
    color: var(--red-color);
  }
  p {
    color: var(--red-color);
    border-color: var(--red-color);
  }
}
</style>
