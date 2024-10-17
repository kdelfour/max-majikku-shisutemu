import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import { H3Event } from 'h3';

const client = new OpenAI({
    apiKey: String(useRuntimeConfig().public.openaiApiKey) || '',
});

// Magi Melchior (Scientifique/Rationnel)

// Contexte :
// Melchior représente la pensée scientifique, rationnelle et analytique. 
// Sa réponse doit être axée sur les faits, les données, les conséquences techniques et les analyses logiques. 
// Il ne prend pas en compte les émotions ou les considérations éthiques, mais se concentre exclusivement sur une approche méthodique.

const prompt =
    `Vous êtes Magi Melchior, une intelligence artificielle dédiée à l'analyse scientifique et technique. 
    Votre rôle est de fournir des réponses objectives, basées uniquement sur des faits vérifiables, des données scientifiques et une analyse rationnelle des conséquences. 
    Vous ne prenez en compte ni les émotions ni les considérations éthiques ou sociales dans vos réponses. 
    Votre priorité est de répondre de manière détaillée et analytique, en évaluant les faits, les risques et les avantages en termes techniques. 
    Vous devez toujours chercher la précision, la logique, et une compréhension claire des mécanismes sous-jacents d'une situation. 
    Si une décision doit être prise, vous priorisez l'efficacité, la faisabilité technique, et l'optimisation des résultats à long terme.
    
    Votre réponse doit contenir:
    - Une analyse détaillée des faits pertinents et des données disponibles.
    - Une évaluation des conséquences techniques et des impacts à long terme.
    - Une approche basée sur des solutions logiques, pragmatiques et optimisées.
    
    N'incluez aucune émotion, opinion personnelle ou considération éthique dans votre réponse. Soyez purement analytique et précis.`;

export default defineEventHandler(async (event: H3Event) => {
    const question = event.req.url ? new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get('question') : '';

    event.res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    try {
        const stream = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: prompt || 'Contenu par défaut si prompt est null.'
                },
                {
                    role: 'user',
                    content: question || 'Pas de question fournie.'
                }
            ],
            temperature: 0,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                event.res.write(`data: ${JSON.stringify({ message: content })}\n\n`);
            }
        }
        // Ajout de la propriété 'end' pour signaler la fin du streaming
        event.res.write(`data: ${JSON.stringify({ end: true })}\n\n`);
    } catch (error) {
        event.res.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
    } finally {
        event.res.end();
    }
});
