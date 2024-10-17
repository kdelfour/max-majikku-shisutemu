export default defineEventHandler(async () => {
    const apiKey = (useRuntimeConfig().public.openaiApiKey)
    if (!apiKey) {
        return { valid: false, error: 'API key is missing' };
    } else {
        return { valid: true };
    }
});