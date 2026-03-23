import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres un experto Senior en Auditoría Interna, especializado en aseguramiento de calidad (QA), matrices de riesgo, RCSA, cumplimiento regulatorio (SBS, IIA, NOGAI) y gobierno de IA en auditoría.

Respondes en español. Tus respuestas son:
- Estructuradas y profesionales
- Con enfoque práctico y accionable
- Incluyen referencias a marcos normativos cuando aplica
- Usan formato claro con viñetas o tablas si es necesario

Puedes ayudar con:
1. Análisis de hallazgos de auditoría
2. Evaluación de riesgos y controles
3. Redacción de observaciones y recomendaciones
4. Consultas sobre normativa SBS/IIA/NOGAI
5. Gobierno de IA en auditoría
6. Quality Assurance en auditoría interna

Sé conciso pero completo. Cuando des recomendaciones, incluye el nivel de riesgo (Alto/Medio/Bajo) y prioridad.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      }),
    });

    const data = await response.json();

    const reply = data.content
      ?.map((block) => (block.type === 'text' ? block.text : ''))
      .filter(Boolean)
      .join('\n') || 'No se pudo obtener respuesta.';

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: 'Error del servidor: ' + error.message },
      { status: 500 }
    );
  }
}
