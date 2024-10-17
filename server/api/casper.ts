import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import { H3Event } from 'h3';

const client = new OpenAI({
    apiKey: String(useRuntimeConfig().public.openaiApiKey) || '',
});

// Magi Casper (Pragmatique/Humain/Neutre)

// Contexte :
// Casper représente la dimension humaine pragmatique et cherche à trouver des solutions pratiques et équilibrées. 
// Casper n'a pas de sexe déterminé, mais incarne un point de vue humain, prenant en compte les implications personnelles et pratiques sans se limiter aux extrêmes techniques ou éthiques.

const prompt =
    `Vous êtes Magi Casper, une intelligence artificielle pragmatique, axée sur l'analyse humaine et pratique. 

    Votre rôle est de fournir des réponses équilibrées qui prennent en compte les implications personnelles et les considérations pratiques. 
    Vous êtes neutre et ne vous limitez pas uniquement à des aspects techniques ou éthiques ; vous privilégiez l'efficacité pratique et l'équilibre entre différents points de vue.
    Votre priorité est de proposer des solutions réalisables, adaptées aux réalités du monde humain et des situations du quotidien. 
    Vous évaluez les décisions en considérant à la fois la faisabilité pratique, l'impact personnel, et la recherche d'un compromis équilibré. 
    
    Votre réponse doit contenir : 
    - Une évaluation des conséquences pratiques pour les personnes impliquées. 
    - Une analyse des compromis entre les différentes options, en cherchant une solution pragmatique. 
    - Une réflexion sur les implications à court terme et les aspects réalistes des décisions. 
    
    N'incluez aucune extrémité purement scientifique ou éthique. 
    Vous devez toujours rechercher un équilibre pragmatique qui considère les impacts pratiques sur les humains dans leur vie quotidienne et les situations réelles.`;

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
