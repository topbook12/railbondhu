import { NextResponse } from 'next/server';

// Partner API documentation and access management

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/trains',
    description: 'Get all trains with schedules',
    auth: 'API Key required',
    rateLimit: '100 requests/minute',
  },
  {
    method: 'GET',
    path: '/api/trains/:id',
    description: 'Get train details by ID',
    auth: 'API Key required',
    rateLimit: '100 requests/minute',
  },
  {
    method: 'GET',
    path: '/api/trains/:id/live-location',
    description: 'Get real-time train location',
    auth: 'API Key required',
    rateLimit: '50 requests/minute',
  },
  {
    method: 'GET',
    path: '/api/stations',
    description: 'Get all stations',
    auth: 'API Key required',
    rateLimit: '100 requests/minute',
  },
  {
    method: 'GET',
    path: '/api/delay-prediction',
    description: 'AI-powered delay predictions',
    auth: 'API Key + Premium plan',
    rateLimit: '30 requests/minute',
  },
  {
    method: 'POST',
    path: '/api/ai/journey-plan',
    description: 'AI-powered journey planning',
    auth: 'API Key + Premium plan',
    rateLimit: '20 requests/minute',
  },
  {
    method: 'GET',
    path: '/api/booking',
    description: 'Search available trains for booking',
    auth: 'API Key + Partner agreement',
    rateLimit: '50 requests/minute',
  },
  {
    method: 'POST',
    path: '/api/booking',
    description: 'Create ticket booking',
    auth: 'API Key + Partner agreement',
    rateLimit: '20 requests/minute',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    requests: '1,000/month',
    features: ['Train schedules', 'Station info', 'Basic search'],
  },
  {
    name: 'Developer',
    price: 29,
    requests: '50,000/month',
    features: ['All Free features', 'Live locations', 'Delay predictions', 'Email support'],
  },
  {
    name: 'Business',
    price: 99,
    requests: '500,000/month',
    features: ['All Developer features', 'AI journey planning', 'Booking API', 'Priority support', 'SLA'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    requests: 'Unlimited',
    features: ['All Business features', 'Dedicated support', 'Custom integrations', 'On-premise option'],
  },
];

// GET - API documentation
export async function GET() {
  return NextResponse.json({
    name: 'RailBondhu Partner API',
    version: '1.0.0',
    description: 'Access train schedules, real-time locations, and booking services',
    baseUrl: 'https://api.railbondhu.com',
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Include your API key in the request header',
    },
    endpoints: apiEndpoints,
    pricing: pricingPlans,
    codeExamples: {
      javascript: `// JavaScript example
const response = await fetch('https://api.railbondhu.com/api/trains', {
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  }
});
const trains = await response.json();`,
      python: `# Python example
import requests

headers = {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
}
response = requests.get('https://api.railbondhu.com/api/trains', headers=headers)
trains = response.json()`,
      curl: `# cURL example
curl -H "X-API-Key: your-api-key" \\
     -H "Content-Type: application/json" \\
     https://api.railbondhu.com/api/trains`,
    },
  });
}

// POST - Register for API access
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, email, website, plan, useCase } = body;

    // In production, this would create a partner account
    const partner = {
      id: `partner_${Date.now()}`,
      companyName,
      email,
      website,
      plan: plan || 'Free',
      useCase,
      apiKey: `rk_live_${generateApiKey()}`,
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Application submitted. We will review and contact you within 2 business days.',
      partner: {
        ...partner,
        // Don't expose the API key until approved
        apiKey: plan === 'Free' ? partner.apiKey : 'Will be provided after approval',
      },
    });
  } catch (error) {
    console.error('Partner registration error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}

function generateApiKey(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
