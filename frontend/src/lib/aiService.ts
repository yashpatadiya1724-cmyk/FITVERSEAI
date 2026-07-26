/**
 * FitVerse AI Service Integrations
 * Powers AI Coach Chat, Workout Regeneration, and Macro Diet Planning
 * using Groq Llama 3 70B & Google Gemini APIs.
 */

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export async function askGroqAICoach(prompt: string, userContext?: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are FitVerse AI Coach, an elite ultra-intelligent fitness & nutrition mentor. Your tone is energetic, scientific, empathetic, and motivational. Use concise bullet points when appropriate. User Context: ${userContext || 'Intermediate athlete looking for hypertrophy and optimal recovery.'}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 450,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'AI Coach analyzed your performance. Keep pushing forward!';
  } catch (error) {
    console.warn('Groq API Call fallback:', error);
    return `AI Coach Guidance: Focus on progressive overload, 8 hours of quality sleep, and proper post-workout protein synthesis. You've got this!`;
  }
}
