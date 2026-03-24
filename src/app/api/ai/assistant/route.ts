import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// AI-powered smart assistant for train queries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context, sessionId } = body;

    const zai = await ZAI.create();

    const systemPrompt = `You are RailBondhu AI Assistant, a helpful train travel assistant for Bangladesh Railway.
    
    You can help users with:
    - Train schedules and routes
    - Real-time train status and delays
    - Station information
    - Travel tips and recommendations
    - Booking guidance
    - Platform and seat information
    
    Always be helpful, concise, and friendly. Respond in the language the user asks in (Bangla or English).
    
    Format responses clearly with bullet points when listing information.`;

    const messages = [
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: message }
    ];

    // Add context if provided
    if (context) {
      messages.splice(1, 0, {
        role: 'assistant',
        content: `Context: ${JSON.stringify(context)}`
      });
    }

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      response,
      sessionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI assistant error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
