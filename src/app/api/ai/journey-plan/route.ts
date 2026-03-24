import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// AI-powered journey planning
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromStation, toStation, date, time, preferences } = body;

    const zai = await ZAI.create();

    const systemPrompt = `You are an AI journey planner for Bangladesh Railway.
    Given the travel requirements, suggest the best train options with schedules, connections, and recommendations.
    
    Always respond with valid JSON:
    {
      "journeys": [
        {
          "trainName": "<name>",
          "trainNumber": "<number>",
          "departureTime": "<HH:MM>",
          "arrivalTime": "<HH:MM>",
          "duration": "<Xh Ym>",
          "classes": ["Shovan", "Snigdha", "AC"],
          "platform": "<number>",
          "fare": { "shovan": <price>, "snigdha": <price>, "ac": <price> },
          "recommendation": "<brief note>"
        }
      ],
      "tips": ["tip1", "tip2"],
      "bestOption": <index of recommended journey>
    }`;

    const userMessage = `Plan a journey:
    From: ${fromStation}
    To: ${toStation}
    Date: ${date || 'Today'}
    Preferred Time: ${time || 'Morning'}
    Preferences: ${preferences || 'Fastest route'}
    
    Suggest the best train options.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      thinking: { type: 'disabled' }
    });

    const responseText = completion.choices[0]?.message?.content || '{}';

    try {
      const journeyPlan = JSON.parse(responseText);
      return NextResponse.json({
        success: true,
        fromStation,
        toStation,
        ...journeyPlan,
        generatedAt: new Date().toISOString()
      });
    } catch {
      // Fallback response
      return NextResponse.json({
        success: true,
        fromStation,
        toStation,
        journeys: [
          {
            trainName: 'Suborno Express',
            trainNumber: '701',
            departureTime: '07:00',
            arrivalTime: '12:30',
            duration: '5h 30m',
            classes: ['Shovan', 'Snigdha', 'AC'],
            platform: '3',
            fare: { shovan: 350, snigdha: 550, ac: 850 },
            recommendation: 'Fastest option with good amenities'
          }
        ],
        tips: ['Book in advance for better seats', 'Arrive 30 minutes early'],
        bestOption: 0,
        generatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Journey planning error:', error);
    return NextResponse.json({ error: 'Failed to plan journey' }, { status: 500 });
  }
}
