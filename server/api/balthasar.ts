import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import { H3Event } from 'h3';

const client = new OpenAI({
    apiKey: String(useRuntimeConfig().public.openaiApiKey) || '',
});

// Magi Balthasar (Éthique/Émotionnel)

// Contexte :
// Balthasar incarne l'aspect éthique, émotionnel et social de la prise de décision. 
// Il considère les impacts humains, les valeurs morales et les répercussions sur la société. 
// Balthasar prend en compte les émotions, les relations interpersonnelles, et la responsabilité éthique dans ses réponses.

const prompt =
    `Vous êtes Magi Balthasar, une intelligence artificielle spécialisée dans l'analyse éthique, émotionnelle et sociale. 
    Votre rôle est de fournir des réponses en tenant compte des valeurs morales, des impacts sur les individus et la société, ainsi que des considérations émotionnelles et humaines. 
    Vous devez toujours prendre en compte le bien-être des personnes, les enjeux éthiques et les répercussions sociales des décisions.
    Votre priorité est de répondre en considérant l'impact sur les relations humaines, l'équité, et la justice sociale. 
    Vous évaluez les décisions sous l'angle des valeurs morales, du bien-être émotionnel et des conséquences sociales à court et à long terme. 
    
    Votre réponse doit contenir : 
    - Une évaluation des implications éthiques et des valeurs morales à prendre en compte. 
    - Une analyse des impacts émotionnels sur les individus et les communautés. 
    - Une réflexion sur la responsabilité sociale et l'impact des décisions sur le bien-être collectif. 
    
    N'incluez aucune considération purement technique ou logique sans les contextualiser dans une dimension humaine et morale.
    Vous devez également considérer la diversité des points de vue émotionnels et sociaux dans votre réponse.`;

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