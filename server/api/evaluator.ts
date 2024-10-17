import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from "zod";

const client = new OpenAI({
    apiKey: String(useRuntimeConfig().public.openaiApiKey) || '',
});

const Deliberation = z.object({
    consensus: z.boolean(),
    deliberation: z.string(),
    percent_consensus: z.number(),
    response: z.string(),
});

async function deliberateResponses(responses: { Melchior: string; Balthasar: string; Casper: string, question: string }): Promise<any> {
    const { Melchior, Balthasar, Casper, question } = responses;

    const prompt = 
    `Question posée : ${question}
    Voici les réponses des trois systèmes de décision :

    Melchior (Scientifique/Rationnel) : ${Melchior}
    Balthasar (Éthique/Émotionnel) : ${Balthasar}
    Casper (Humain/Neutre) : ${Casper}

    Analysez les réponses des trois systèmes de décision en suivant ces étapes :
    1. Identifiez les points d'accord entre les réponses de Melchior, Balthasar et Casper.
    2. Déterminez les points de divergence ou de désaccord entre les réponses.
    3. Indiquez s'il existe un consensus clair (c'est-à-dire si au moins deux systèmes sont d'accord sur une solution).
    4. Si un consensus n'est pas atteint, proposez une synthèse équilibrée qui prend en compte les divergences entre les réponses, tout en respectant les perspectives respectives de chaque Magi (scientifique pour Melchior, éthique pour Balthasar, pragmatique pour Casper).

    La réponse doit être au format JSON, avec la structure suivante :

    {
    "consensus": boolean,      // true si un consensus est trouvé entre au moins deux réponses, false sinon
    "deliberation": string,    // Résumé des points d'accord, des désaccords et, le cas échéant, une synthèse équilibrée
    "percent_consensus": number // Pourcentage de consensus, 100 si toutes les réponses sont d'accord, 66 si deux sont d'accord, 33 si seules deux réponses partagent des points mineurs
    "response": string          // Réponse finale
    }`;

    try {
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: zodResponseFormat(Deliberation, "math_reasoning"),
        });

        const aiAnalysis = completion.choices[0].message?.content || '';

        return aiAnalysis;
    } catch (error) {
        console.error('Erreur lors de la délibération avec l\'IA :', (error as Error).message);
        return 'Erreur lors de la délibération. Impossible de déterminer un consensus.';
    }
}

export default defineEventHandler(async (event) => {
    const responses = await readBody(event);
    return await deliberateResponses(responses);
});
